import { SupabaseAuthAPI } from "./supabase/SupabaseAuthAPI";
import { AuthError, createClient, User } from '@supabase/supabase-js'
import { supabaseConfig } from "../config/supabaseConfig";
import { CodeEntity } from "../data/CodeEntity";
import { UserEntity } from "../data/UserEntity";
import { API_ERROR } from "../constants/define";

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
        try {
            const { error } = await supabase.auth.signOut();
        } catch (e: any) {
            console.log(e);
            throw new Error('로그아웃에 실패했습니다.');
        }
    }

    async getAllCode(): Promise<CodeEntity[]> {
        try {
            const { data, error } = await supabase.from('post')
                .select('*, code!inner(*)')
                .order('created_at', { ascending: false });

            let lstCodeModel: CodeEntity[] = [];
            data?.forEach((e) => {
                let codeModel: CodeEntity = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.images,
                    price: e.code.cost,
                    userToken: e.user_token,
                    category: e.category,
                    createdAt: e.created_at,
                    hashTag: e.hash_tag,
                    state: e.state,
                    adminGitRepoURL: e.code.github_repo_url,
                }
                lstCodeModel.push(codeModel);
            });
            console.log(data);
            return lstCodeModel;
        }
        catch (e: any) {
            console.log(e);
            throw new Error('게시글 목록을 가져오는 데 실패했습니다.');
        }

    }

    async resetPasswordByEmail(email: string) {
        try {
            const { data, error } = await supabase.auth
                //.resetPasswordForEmail(email, { redirectTo: 'http://localhost:3000/change-password' });
                .resetPasswordForEmail(email, { redirectTo: 'https://main--coderoom-io.netlify.app/reset-password' });
        }
        catch (e: any) {
            console.log(e);
            throw new Error('비밀번호 재설정에 실패했습니다.');
        }
    }

    async signUpByEmail(email: string, password: string): Promise<User> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            console.log(data);
            if(error){
                throw new Error(API_ERROR.USER_ALREADY_REGISTERED);
            }
            return data.user!;
        }
        catch (e: any) {
            console.log(e);
            if(e){
                throw new Error(API_ERROR.USER_ALREADY_REGISTERED);
                
            }
            throw new Error('이메일 회원가입에 실패하였습니다.');
        }
    }

    async insertUserData(user: UserEntity) {
        try {

            const userData = {
                "auth_type": user.authType,
                "email": user.email,
                "name": user.name,
                "nickname": user.nickname,
                "profile_url": user.profileUrl,
                "about_me": user.aboutMe,
                "contacts": user.contacts,
                "user_token": user.userToken,
            }

            const { data, error } = await supabase.from('users')
                .insert(userData).select();
            if(error){
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('회원정보 저장에 실패하였습니다.');
            }
           

        } catch (e: any) {
            console.log(e);
            throw new Error('회원정보 저장에 실패하였습니다.');
        }
    }

    async updateUserPassword(newPassword: string) {
        try {
            const { data, error } = await supabase.auth
                .updateUser({ password: newPassword });
            console.log(data);
        }
        catch (e: any) {
            console.log(e);
            throw new Error('비밀번호 업데이트에 실패했습니다.');
        }

    }



}

export const apiClient = new ApiClient();