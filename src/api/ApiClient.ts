import { SupabaseAuthAPI } from "./supabase/SupabaseAuthAPI";
import { AuthError, createClient, User } from '@supabase/supabase-js'
import { supabaseConfig } from "../config/supabaseConfig";
import { CodeModel } from "../data/model/CodeModel";
import { UserEntity } from "../data/entity/UserEntity";
import { API_ERROR } from "../constants/define";
import { UserModel } from "../data/model/UserModel";

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

    async getAllCode(): Promise<CodeModel[]> {
        try {
            const { data, error } = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('state',"confirmed")
                .order('created_at', { ascending: false });

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.images,
                    price: e.code.cost,
                    userToken: e.user_token,
                    category: e.category,
                    postType : e.post_type,
                    createdAt: e.created_at,
                    buyerGuide : e.code.buyer_guide,
                    buyerCount : e.code.buyer_count,
                    popularity: e.code.popularity,
                    hashTag: e.hash_tag,
                    state: e.state,
                    adminGitRepoURL: e.code.github_repo_url,
                    viewCount : e.view_count,
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
            if (error) {
                throw new Error(API_ERROR.USER_ALREADY_REGISTERED);
            }
            return data.user!;
        }
        catch (e: any) {
            console.log(e);
            if (e) {
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
            if (error) {
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

    async insertImgUrl(postId:number, imageUrls: string[]){
        try {
            const { error } = await supabase.from('post')
                .update({img_urls : imageUrls}).eq('id',postId);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('이미지 링크 저장에 실패하였습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('이미지 링크 저장에 실패하였습니다.');
        }
    }

    async getImgPublicUrl(path: string): Promise<string> {
        try {
            const { data } = supabase
                .storage
                .from('coderoom')
                .getPublicUrl(path);
                console.log("publicurl: "+data.publicUrl);
            return data.publicUrl;
        } catch (e: any) {
            console.log(e);
            throw new Error('이미지 주소 다운에 실패했습니다.');
        }
    }

    async uploadImages(userToken: string, postId: number, files: File[]): Promise<string[]> {
        try {

            const lstPublicUrl: string[] = [];

            for (const file of files) {

                const path: string = `boards/code/${userToken}_${postId}_${file.name}.png`;

                const { data, error } = await supabase
                    .storage
                    .from('coderoom')
                    .upload(path, file);
                const publicUrl = await this.getImgPublicUrl(path);
                lstPublicUrl.push(publicUrl);

                if(error){
                    console.log("error" + error.message);
                    console.log("error" + error.name);
                    console.log("error" + error.stack);
    
                    throw new Error('이미지 저장에 실패했습니다.');
                }
            }
           
            return lstPublicUrl;

        } catch (e: any) {
            console.log(e);
            throw new Error('이미지 저장에 실패했습니다.');
        }
    }

    async insertPostData(post: PostRequestEntity): Promise<number> {
        try {
            const { data, error } = await supabase.from('post')
                .insert(post).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글 업로드에 실패하였습니다.');
            }
            //const postString:string = JSON.stringify(data);

            let postId: number =-1;

            data.map((e) => {
                postId = e.id;
            });

            console.log("this is post: " + postId.toString());
            return postId;

        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 업로드에 실패하였습니다.');
        }
    }

    async insertCodeData(post: CodeRequestEntity) {
        try {
            const { data, error } = await supabase.from('code')
                .insert(post).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글(코드) 업로드에 실패하였습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('게시글(코드) 업로드에 실패하였습니다.');
        }
    }

    async getTargetCode(postId : number): Promise<CodeModel> {
        try {
            const { data, error } = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('id',postId);

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.images,
                    price: e.code.cost,
                    userToken: e.user_token,
                    buyerGuide : e.code.buyer_guide,
                    category: e.category,
                    createdAt: e.created_at,
                    postType : e.post_type,
                    popularity: e.code.popularity,
                    buyerCount : e.code.buyer_count,
                    hashTag: e.hash_tag,
                    state: e.state,
                    viewCount : e.view_count,
                    adminGitRepoURL: e.code.github_repo_url,
                }
                lstCodeModel.push(codeModel);
            });
            console.log("target"+data);

            if(error){
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
            }

            return lstCodeModel[0];
        }
        catch (e: any) {
            console.log(e);
            throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
        }

    }

    async getTargetUser(targetUserToken : string): Promise<UserModel> { // userModel만들기
        try {
            const { data, error } = await supabase.from('users')
                .select('*')
                .eq('user_token',targetUserToken);

            let lstUserModel: UserModel[] = [];
            data?.forEach((e) => {
                let userModel: UserModel = {
                    id: e.id,
                    authType : e.auth_type,
                    email : e.email,
                    name : e.name,
                    nickname : e.nickname,
                    profileUrl : e.profile_url,
                    aboutMe : e.about_me,
                    contacts : e.contacts,
                    userToken : e.user_token,
                    createdAt: e.created_at,
                }
                lstUserModel.push(userModel);
            });
            console.log(data);

            if(error){
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
            }

            return lstUserModel[0];
        }
        catch (e: any) {
            console.log(e);
            throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
        }

    }





}

export const apiClient = new ApiClient();