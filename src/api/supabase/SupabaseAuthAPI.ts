import { User } from "@supabase/supabase-js";

export interface SupabaseAuthAPI{
    loginWithEmail : (email:string, password:string) => Promise<User | Boolean>
}