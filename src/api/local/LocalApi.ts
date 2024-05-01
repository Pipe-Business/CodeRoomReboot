class LocalApi{
    private static SUPABASE_USER_TOKEN = "SUPABASE_USER_TOKEN";
    private static USER_ID ="USER_ID"

    saveUserId(userId:string){
        return localStorage.setItem(LocalApi.USER_ID,userId)
    }

    getUserId():string|null{
        return localStorage.getItem(LocalApi.USER_ID);
    }

    saveUserToken(userToken:string){
        return localStorage.setItem(LocalApi.SUPABASE_USER_TOKEN,userToken);
    }
    getUserToken():string|null{
        return localStorage.getItem(LocalApi.SUPABASE_USER_TOKEN);
    }
}

export default new LocalApi();