import {atom, RecoilState} from "recoil";
import {GptCodeInfoEntity} from "../../data/entity/GptCodeInfoEntity";
import {CodeModel} from "../../data/model/CodeModel";

export const gptGeneratedCodeInfo:RecoilState<GptCodeInfoEntity | null> = atom<GptCodeInfoEntity | null>({
    key:"gptGeneratedCodeInfo",
    default: null
});

export const codeInfo:RecoilState<CodeModel | null> = atom<CodeModel | null>({
    key:"codeInfo",
    default: null
});