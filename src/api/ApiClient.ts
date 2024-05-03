import { SupabaseAuthAPI } from "./supabase/SupabaseAuthAPI";
import { createClient, User } from '@supabase/supabase-js'
import { supabaseConfig } from "../config/supabaseConfig";
import { CodeEntity } from "../data/CodeEntity";

export const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);

class ApiClient implements SupabaseAuthAPI {
    constructor(
        private readonly auth = supabase.auth,
    ) { }

    async loginWithEmail(email: string, password: string): Promise<User | Boolean> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (data.user == null) {
                console.log(error?.message);
                console.log(error?.stack);
                console.log(false);
                return false;
            }
            return data.user;

        } catch (e: any) {
            console.log(e);
            throw new Error('비밀번호가 정확하지 않습니다.');
        }
    }

    async signOut() {
        try{
            const { error } = await supabase.auth.signOut();
        }catch(e:any){
            console.log(e);
            throw new Error('로그아웃에 실패했습니다.');
        }
    }

    //async getAllCode() : Promise<CodeModel[]>{
//         const { data, error } = await supabase
//   .from('cities')
//   .select('name, countries!inner(name)')
//   .eq('countries.name', 'Indonesia')
    async getAllCode() : Promise<CodeEntity[]>{
       try{ const { data,error } = await supabase.from('post')
        .select('*, code!inner(*)')
        .order('created_at',{ascending:false});
        
        let lstCodeModel:CodeEntity[] = [];
        data?.forEach((e) => {
            let codeModel:CodeEntity = {
                id : e.id,
                title : e.title,
                description : e.description,
                images : e.images,
                price : e.code.cost,
                userToken : e.user_token,
                category : e.category,
                createdAt : e.created_at,
                hashTag : e.hash_tag,
                state : e.state,
                adminGitRepoURL : e.code.github_repo_url,
            }
            lstCodeModel.push(codeModel);
        });
        console.log(data);
        return lstCodeModel;
    }
        catch(e:any){
            console.log(e);
            throw new Error('게시글 목록을 가져오는 데 실패했습니다.');
        }

    }

}

export const apiClient = new ApiClient();