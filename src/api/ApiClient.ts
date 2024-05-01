import { SupabaseAuthAPI } from "./supabase/SupabaseAuthAPI";
import { createClient, User } from '@supabase/supabase-js'
import { supabaseConfig } from "../config/supabaseConfig";
import { toast } from 'react-toastify';

const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);

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
                toast.error('회원 정보가 없습니다.');
                console.log(error?.message);
                console.log(error?.stack);
                console.log(false);
                return false;
            }
            return data.user;

        } catch (e: any) {
            toast.error('회원 정보가 없습니다.');
            console.log(e);
            throw new Error('비밀번호가 정확하지 않습니다.');
        }
    }

}

export const apiClient = new ApiClient();