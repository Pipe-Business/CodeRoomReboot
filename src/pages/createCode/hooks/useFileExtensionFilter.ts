import {useState} from "react";
import {fetchFileContent, fetchRepoFiles} from "../../admin/services/githubService";
import {apiClient} from "../../../api/ApiClient";

interface FileNode {
    name: string;
    download_url: string;
    path: string;
    type: string;
    content?: string;
    analysis?: string;
}

const SUPPORTED_EXTENSIONS = ['.py', '.js', '.ts', '.java', '.cpp', '.cs', '.dart'];

const useFileExtensionFilter = () => {
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [totalCodeFileLength, setTotalCodeFileLength] = useState<number>(0);

        const getFiles = async (owner:string, repo:string) => {
            try{
                const fileList = await fetchRepoFiles(owner, repo);
                //console.log('Fetched file list:', fileList);
                const codeFiles = fileList.filter((file: FileNode) =>
                    file.type === 'file' && SUPPORTED_EXTENSIONS.some(ext => file.name.endsWith(ext))
                );

                setTotalCodeFileLength(codeFiles.length);

                const fileContents = await Promise.all(codeFiles.map(async (file: FileNode) => {
                    const content = await fetchFileContent(file.download_url);
                    return { ...file, content };
                }));

                setFileNames(codeFiles.map((file: FileNode) => file.name));
              // const recommandedTitle = await apiClient.makeTitleBygpt(fileContents.toString());
               //const readMe = await apiClient.getReadMe(`https://github.com/${owner}/${repo}`); // todo 초대 되어있는 상황이라 가져올 수 있다.
               //console.log("recomannededTitle:", recommandedTitle);
                //console.log("readMe:", readMe);
                return fileContents;

            }catch(err){
                if (err instanceof Error) {
                    console.error('Error in useRepoFiles:', err.message);
                    setError(err.message);
                } else {
                    setError('알 수 없는 오류가 발생했습니다.');
                }
            }
        }
    return { getFiles, totalCodeFileLength: totalCodeFileLength, fileNames, error };

}

export default useFileExtensionFilter;