import { User } from "@supabase/supabase-js";
import { CodeEntity } from "../../data/CodeEntity";
export interface SupabaseAuthAPI{
    loginWithEmail : (email:string, password:string) => Promise<User | Boolean>
    signOut : () => void
    getAllCode : () => Promise<CodeEntity[]>
}