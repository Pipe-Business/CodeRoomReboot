import axios from 'axios';

export const FIREBASE_FUNCTIONS_URL = "https://us-central1-coderoom-c8e3f.cloudfunctions.net/githubapi"

export const fetchRepoFiles = async (owner: string, repo: string, path: string = '') => {
    try {
        const response = await axios.get(`${FIREBASE_FUNCTIONS_URL}/repo-files/${owner}/${repo}`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching file content:', error.response?.data || error.message);
        } else {
            console.error('Unknown error:', error);
        }
        throw new Error('파일 내용을 가져오는 중 오류가 발생했습니다');
    }
};

export const fetchFileContent = async (url: string) => {
    try {
        const response = await axios.get(`${FIREBASE_FUNCTIONS_URL}/file-content`, {
            params: { url }
        });
        console.log(response.data);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching repo files:', error.response?.data || error.message);
        } else {
            console.error('Unknown error:', error);
        }
        throw new Error('레포지토리 파일을 가져오는 중 오류가 발생했습니다');
    }
};
