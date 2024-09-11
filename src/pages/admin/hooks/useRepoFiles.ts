import { useState, useEffect, useCallback } from 'react';
import { fetchRepoFiles, fetchFileContent } from '../services/githubService';

interface FileNode {
    name: string;
    download_url: string;
    path: string;
    type: string;
    content?: string;
}

const SUPPORTED_EXTENSIONS = ['.py', '.js', '.ts', '.java', '.cpp', '.cs', '.dart', '.c', '.tsx', '.kt'];
const INITIAL_DELAY = 5000; // 5 seconds

interface UseRepoFilesReturn {
    files: FileNode[];
    fileNames: string[];
    loading: boolean;
    error: string | null;
    totalCodeFiles: number;
}

const useRepoFiles = (initialOwner: string, initialRepo: string): UseRepoFilesReturn => {
    const [owner, setOwner] = useState<string>(initialOwner);
    const [repo, setRepo] = useState<string>(initialRepo);
    const [files, setFiles] = useState<FileNode[]>([]);
    const [fileNames, setFileNames] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalCodeFiles, setTotalCodeFiles] = useState<number>(0);
    const [hasLoaded, setHasLoaded] = useState<boolean>(false);

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const getFiles = useCallback(async () => {
        if (hasLoaded) return;

        setLoading(true);
        try {
            const fileList = await fetchRepoFiles(owner, repo);
            console.log('Fetched file list:', fileList);
            const codeFiles = fileList.filter((file: FileNode) =>
                file.type === 'file' && SUPPORTED_EXTENSIONS.some(ext => file.name.endsWith(ext))
            );

            setTotalCodeFiles(codeFiles.length);
            console.log('Code files:', codeFiles.map((file: FileNode) => file.name));

            const fileContents = await Promise.all(codeFiles.map(async (file: FileNode) => {
                const content = await fetchFileContent(file.download_url);
                return { ...file, content };
            }));

            setFiles(fileContents);
            setFileNames(codeFiles.map((file: FileNode) => file.name));
            setHasLoaded(true);
        } catch (err) {
            if (err instanceof Error) {
                console.error('Error in useRepoFiles:', err.message);
                setError(err.message);
            } else {
                setError('알 수 없는 오류가 발생했습니다.');
            }
        } finally {
            setLoading(false);
        }
    }, [owner, repo, hasLoaded]);

    useEffect(() => {
        getFiles();
    }, [getFiles]);

    useEffect(() => {
        if (initialOwner !== owner) setOwner(initialOwner);
        if (initialRepo !== repo) setRepo(initialRepo);
    }, [initialOwner, initialRepo]);

    useEffect(() => {
        if (hasLoaded) {
            setHasLoaded(false);
        }
    }, [owner, repo]);

    return { files, fileNames, loading, error, totalCodeFiles };
};

export default useRepoFiles;