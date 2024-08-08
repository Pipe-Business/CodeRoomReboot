import { useState, useEffect } from 'react';
import {analyzeCode, suggestRefactorByGpt} from "../../admin/services/chatGptService";
import useFileExtensionFilter from "./useFileExtensionFilter";
import {apiClient} from "../../../api/ApiClient";

// 파일 노드 인터페이스 정의
interface FileNode {
    name: string;
    download_url: string;
    path: string;
    type: string;
    content?: string;
    analysis?: string;
}

// 초기 지연 시간 (5초)
const INITIAL_DELAY = 5000; // 5 seconds
// 최대 재시도 횟수
const MAX_RETRIES = 3;
// 훅의 반환 타입 정의

interface UseRepoFilesReturn {
    files: FileNode[];
    fileNames: string[];
    isLoading: boolean;
    error: string | null;
    totalCodeFileLength: number;
}

const useRefactor = (owner: string, repo: string): UseRepoFilesReturn => {
    const {getFiles, totalCodeFileLength, fileNames, error} = useFileExtensionFilter();
    const [files, setFiles] = useState<FileNode[]>([]);
    // const [fileNames, setFileNames] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<string | null>(null);
    // 지연 함수 정의

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    // 분석 재시도 함수 정의
    const analyzeWithRetry = async (content: string, retries = 0): Promise<string> => {
        try {
            // 분석 코드 실행
            //return await suggestRefactorByGpt(content);
            return await apiClient.refactoringByGpt(content);
        } catch (err) {
            // 에러가 '429' (Rate Limit Exceeded)이고 재시도 횟수가 최대를 넘지 않는 경우
            if (err instanceof Error && err.message.includes('429') && retries < MAX_RETRIES) {
                console.log(`Rate limit hit, retrying in ${INITIAL_DELAY * (retries + 1)}ms...`);
                await delay(INITIAL_DELAY * (retries + 1));
                return analyzeWithRetry(content, retries + 1);
            }
            // 재시도 최대 횟수 초과 시 에러를 다시 던짐
            throw err;
        }
    };

    // useEffect 훅: 컴포넌트가 마운트되거나 owner, repo가 변경될 때 실행
    useEffect(() => {
        const doRefactor = async () => {
            setIsLoading(true);
            try {

               const fileContents = await getFiles(owner, repo); // 파일 get 및 필터링
                const analyzedFiles: FileNode[] = [];
                for (const file of fileContents!) {
                    if (file.content) {
                        try {
                            // 분석 실행
                            const analysis = await analyzeWithRetry(file.content);
                            analyzedFiles.push({ ...file, analysis });
                            // Update state after each file is analyzed
                            // 각 파일 분석 후 상태 업데이트
                            setFiles([...analyzedFiles]);
                        } catch (err) {
                            console.error(`Failed to analyze ${file.name}:`, err);
                            analyzedFiles.push({ ...file, analysis: 'Analysis failed' });
                        }
                        // Add delay between each analysis
                        // 분석 간 지연 추가
                        await delay(INITIAL_DELAY);
                    } else {
                        analyzedFiles.push(file);
                    }
                }

            } catch (err) {
                if (err instanceof Error) {
                    console.error('Error in useRepoFiles:', err.message);
                    setIsError(err.message);
                } else {
                    setIsError('알 수 없는 오류가 발생했습니다.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        doRefactor();
    }, [owner, repo]);

    return { files, fileNames, isLoading, error: isError, totalCodeFileLength };
};

export default useRefactor;