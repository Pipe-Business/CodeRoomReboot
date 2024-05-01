import { SupabaseAuthAPI } from "./supabase/SupabaseAuthAPI";
import { createClient, User } from '@supabase/supabase-js'
import { supabaseConfig } from "../config/supabaseConfig";

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

}

export const apiClient = new ApiClient();