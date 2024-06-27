import {atom} from "recoil";

export const paymentDialogState  = atom({
    key: "paymentDialogOpen", // key 지정
    default: false, // default 값 지정
});