import {useEffect, useState} from "react";
import {fetchFileContent, fetchRepoFiles} from "../../admin/services/githubService";
import {analyzeCode} from "../../admin/services/chatGptService";

interface FileNode {
    name: string;
    download_url: string;
    path: string;
    type: string;
    content?: string;
    analysis?: string;
}

const SUPPORTED_EXTENSIONS = ['.py', '.js', '.ts', '.java', '.cpp', '.cs', '.dart'];
const INITIAL_DELAY = 5000; // 5 seconds
const MAX_RETRIES = 3;
const useFileExtensionFilter = () => {
    const [files, setFiles] = useState<FileNode[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCodeFiles, setTotalCodeFiles] = useState<number>(0);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const analyzeWithRetry = async (content: string, retries = 0): Promise<string> => {
        try {
            return await analyzeCode(content);
        } catch (err) {
            if (err instanceof Error && err.message.includes('429') && retries < MAX_RETRIES) {
                console.log(`Rate limit hit, retrying in ${INITIAL_DELAY * (retries + 1)}ms...`);
                await delay(INITIAL_DELAY * (retries + 1));
                return analyzeWithRetry(content, retries + 1);
            }
            throw err;
        }
    };

        const getFiles = async (owner:string, repo:string) => {
            setLoading(true);
            try{
                const fileList = await fetchRepoFiles(owner, repo);
                console.log('Fetched file list:', fileList);
                const codeFiles = fileList.filter((file: FileNode) =>
                    file.type === 'file' && SUPPORTED_EXTENSIONS.some(ext => file.name.endsWith(ext))
                );

                setTotalCodeFiles(codeFiles.length);

                const fileContents = await Promise.all(codeFiles.map(async (file: FileNode) => {
                    const content = await fetchFileContent(file.download_url);
                    return { ...file, content };
                }));

                const analyzedFiles: FileNode[] = [];

                for (const file of fileContents) {
                    if (file.content) {
                        try {
                            //const analysis = await analyzeWithRetry(file.content);
                            const analysis = await analyzeCode(file.content);
                            analyzedFiles.push({ ...file, analysis });
                            // Update state after each file is analyzed
                            setFiles([...analyzedFiles]);
                            //console.log("anaylzed"+JSON.stringify(analyzedFiles));
                        } catch (err) {
                            console.error(`Failed to analyze ${file.name}:`, err);
                            analyzedFiles.push({ ...file, analysis: 'Analysis failed' });
                        }
                        // Add delay between each analysis
                        //await delay(INITIAL_DELAY);
                    } else {
                        analyzedFiles.push(file);
                    }
                }

                //setFiles([...fileContents]);
                setFileNames(codeFiles.map((file: FileNode) => file.name));
                return files;
                //return {files, fileNames, loading, error, totalCodeFiles}

            }catch(err){
                if (err instanceof Error) {
                    console.error('Error in useRepoFiles:', err.message);
                    setError(err.message);
                } else {
                    setError('알 수 없는 오류가 발생했습니다.');
                }
            }finally {
                setLoading(false);
            }
        }
    return {getFiles};

}

export default useFileExtensionFilter;