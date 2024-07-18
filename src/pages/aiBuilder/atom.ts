import {atom, RecoilState} from "recoil";

export const suggestPromptState:RecoilState<string[]> = atom({
    key:"suggestPromptState",
    default: [""],
});

export const aiBuilderStepStatus:RecoilState<number> = atom({
    key:"aiBuilderStepStatus",
    default: 0,
});