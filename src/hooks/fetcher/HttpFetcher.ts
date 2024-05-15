import {QueryKey, useQuery} from "@tanstack/react-query";
import axios from "axios";

//export const serverURL = import.meta.env.VITE_PRODUCTION==="true"?"https://us-central1-coderoom-c8e3f.cloudfunctions.net/api":"http://localhost:3000"
export const serverURL = "https://us-central1-coderoom-c8e3f.cloudfunctions.net/githubapi"
console.log(serverURL);

export type ResponseType = {
    downloadURL:string
}
const fetch = async(userName:string,codeName:string,branch:string)=>{
    try{
        console.log(userName,codeName,branch)
        const result = await axios.get(`${serverURL}/download/${userName}/${codeName}/${branch}`)
        return result.data as ResponseType
    }catch (e) {
        console.log(e)
    }

}

export const codeDownloadQuery = (queryKey:QueryKey,userName:string,codeName:string,branch:string="main")=>{
    return useQuery({
        queryKey:queryKey,
        queryFn:async ()=>await fetch(userName,codeName,branch)
    })
}