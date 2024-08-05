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
            const title =  await apiClient.makeTitleBygpt(result!.toString());
            setRecommandedTitle(title);
            setLoading(false);
        }
        contentRecommender();
    }, []);
    return {recommandedTitle, loading}
}