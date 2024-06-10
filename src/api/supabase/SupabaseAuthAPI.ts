import { User } from "@supabase/supabase-js";
import {MainPageCodeListEntity} from "../../data/entity/MainPageCodeListEntity";
export interface SupabaseAuthAPI{
    loginWithEmail : (email:string, password:string) => Promise<User | Boolean>
    signOut : () => void
    getAllCode : () => Promise<MainPageCodeListEntity[]>
}