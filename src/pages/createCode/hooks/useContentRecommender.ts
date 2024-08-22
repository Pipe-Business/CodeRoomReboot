import {useEffect, useState} from "react";
import useFileExtensionFilter from "./useFileExtensionFilter";
import {apiClient} from "../../../api/ApiClient";

export const useContentRecommender = (repoName:string, owner:string) => {
    const {getFiles} = useFileExtensionFilter();
    const [recommandedTitle, setRecommandedTitle] = useState<String>();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        const contentRecommender = async () => {
            setLoading(true);
            const result = await getFiles(owner, repoName);
            const title =  await apiClient.makeCodeInfoByGPT(result!.toString());
            //setRecommandedTitle(title); // TODO 로직 및 사용처 확인 후 안쓰면 제거
            setLoading(false);
        }
        contentRecommender();
    }, []);
    return {recommandedTitle, loading}
}