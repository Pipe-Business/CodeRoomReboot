import React, { useCallback, useState } from 'react';

export type InputValidateOption = {
	defaultValue?: string
	minLen?: number,
	maxLen?: number,
	minLenErrMessage?: string,
	maxLenErrMessage?: string,
	isBlankCheck?: boolean,
	isBlankCheckMessage?: string,
	regex?: RegExp,
	validRegexMessage?: string,
	successMessage?: string,
}

export const useInputValidate = (options?: InputValidateOption): [
	string, // inputValue 의 타입
	(e: React.ChangeEvent<HTMLInputElement>) => void, // onChange 의 타입
	boolean, // error 의 타입
	string, // errorMsg 의 타입
	React.Dispatch<React.SetStateAction<string>>, // setInput 의 타입,
	boolean, // error 의 타입
	string, // errorMsg 의 타입
	React.Dispatch<React.SetStateAction<boolean>>, // setInput 의 타입,
	React.Dispatch<React.SetStateAction<string>>, // setInput 의 타입,
	React.Dispatch<React.SetStateAction<boolean>>, // setInput 의 타입,
	React.Dispatch<React.SetStateAction<string>>, // setInput 의 타입,
	number,
	React.Dispatch<React.SetStateAction<number>>, // word count 의 타입,

] => {
	const initOption: InputValidateOption = {
		defaultValue: options?.defaultValue ?? '',
		minLen: options?.minLen,
		maxLen: options?.maxLen,
		minLenErrMessage: `최소 ${options?.minLen} 글자 이상 입력해주세요`,
		maxLenErrMessage: `최대 ${options?.maxLen} 글자 이하로 입력해주세요`,
		isBlankCheck: true,
		isBlankCheckMessage: '빈칸을 입력해주세요',
		validRegexMessage: options?.validRegexMessage,
		successMessage: options?.successMessage ?? '알맞게 입력하셨어요',
	};
	const [inputValue, setInput] = useState(initOption.defaultValue);
	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
	const [wordLen,setWordLen] =useState(initOption.defaultValue?.length ?? 0)
	const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		let errorMessage = '';
		let isError = true;
		// 빈칸 체크
		if (initOption.isBlankCheck && value === '') {
			errorMessage = initOption.isBlankCheckMessage!;
			isError = true; // 에러 발생 시 true로 설정
		}
		// 최소 길이 체크
		else if (options?.minLen && value.length < options.minLen) {
			errorMessage = initOption.minLenErrMessage!;
			isError = true; // 에러 발생 시 true로 설정
		}
		// 최대 길이 체크
		else if (options?.maxLen && value.length > options.maxLen) {
			errorMessage = initOption.maxLenErrMessage!;
			isError = true; // 에러 발생 시 true로 설정
		} else if (options?.regex && !options.regex.test(value)) {
			errorMessage = initOption.validRegexMessage!;
			isError = true;

		} else {
			isError = false;
			errorMessage = '';
			setSuccess(true);
			setSuccessMsg(initOption?.successMessage!);
		}
		setWordLen(e.target.value.length)

		setInput(value);
		setError(isError); // 에러 발생 여부 설정
		setErrorMsg(errorMessage);
	}, [inputValue, options, initOption,wordLen]);
	// @ts-ignore
	return [inputValue, onChange, error, errorMsg, setInput, success, successMsg, setError, setErrorMsg, setSuccess, setSuccessMsg,wordLen,setWordLen];
};
