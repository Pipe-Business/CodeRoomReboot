import {atom, RecoilState} from "recoil";
import {GptCodeInfoEntity} from "../../data/entity/GptCodeInfoEntity";

export const gptGeneratedCodeInfo:RecoilState<GptCodeInfoEntity | null> = atom<GptCodeInfoEntity | null>({
    key:"gptGeneratedCodeInfo",
    default: null
});