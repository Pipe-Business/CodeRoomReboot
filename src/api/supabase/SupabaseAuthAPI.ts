import { User } from "@supabase/supabase-js";
import { CodeModel } from "../../data/model/CodeModel";
export interface SupabaseAuthAPI{
    loginWithEmail : (email:string, password:string) => Promise<User | Boolean>
    signOut : () => void
    getAllCode : () => Promise<CodeModel[]>
}