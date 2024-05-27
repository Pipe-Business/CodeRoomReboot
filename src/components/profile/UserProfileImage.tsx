import React, {FC} from "react";
import {Avatar, Skeleton} from "@mui/material";
//import gravatar from "gravatar";
import {useQuery} from "@tanstack/react-query"
import { UserModel } from "../../data/model/UserModel";
import { apiClient } from "../../api/ApiClient";
import gravatar from "gravatar";

interface Props {
    children?: React.ReactNode,
    userId:string,
    size?:number,
}

const UserProfileImage: FC<Props> = ({userId,size}) => {
    const {data:userData} = useQuery({queryKey:['users',userId],queryFn: async () => await apiClient.getTargetUser(userId)})
    if(!userData){
        return <Skeleton variant={"circular"}/>
    }
    if(userData?.profileUrl){
        return (
            <Avatar src={userData.profileUrl} sx={{width:size?size:45,height:size?size:45}}/>
        )
    }
    else{
        return (
            <Avatar src={gravatar.url(userData?.email!,{s:'100',d:'retro'})} sx={{width:size?size:45,height:size?size:45}}/>
        )
    }
};

export default UserProfileImage;