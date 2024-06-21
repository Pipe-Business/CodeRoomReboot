export const EMAIL_EXP: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const REACT_QUERY_KEY = {
    login : '/login',
	code : '/codeStore',
	approvedCode : '/approvedCode',
	pendingCode : '/pendingCode',
	rejectedCode : '/rejectedCode',
	user : '/users',
	cash : '/cash',
	cashHistory: '/cashHistory',
	pointistory: '/pointHistory',
	totalCashPoint: '/totalCashPoint',
	cashPointHistory: '/cashPointHistory',
	cashConfirm: '/cashConfirm',
	cashConfirmPending: '/cashConfirmPending',
	point : '/point',
	purchaseSaleHistory : '/purchaseSaleHistory',
	like : '/like',
	mentoring : '/mentoring',
	notification: '/notification',
	
}

export const API_ERROR = {
    USER_ALREADY_REGISTERED : 'USER_ALREADY_REGISTERED',
}

export const LANGUAGE_FILTER = [
	'JavaScript',
	'TypeScript',
	'JAVA',
	'Python',
	'C++',
	'C#',
	'Ruby',
	'Swift',
	'Kotlin',
	'Go',
	'PHP',
	'Rust',
	'C#',
	'Dart',
	'기타',
];

export const CATEGORY_TO_KOR = {
	frontend: '프론트엔드',
	webPublishing: '웹 퍼블리싱',
	app: '앱개발',
	desktop: '데스크탑개발',
	backendServer: '서버(백엔드)',
	gameDevelop: '게임개발',
	blockChain: '블록체인',
	AI: 'AI',
	dataAnalysis: '데이터분석',
	other: '기타',
};

export const CACHE_CHARGE_PRD = {
	CACHE_1000: 1000,
	CACHE_3000: 3000,
	CACHE_5000: 5000,
	CACHE_10000: 10000.
}

export const REWARD_COIN = {
	SIGNUP_BONUS_COIN: 1000,
	INTRODUCTION_BONUS_COIN: 500,
	PROFILE_IMG_BONUS_COIN: 100,
	CACHE_CHARGE_1000_BONUS_COIN: CACHE_CHARGE_PRD.CACHE_1000 * 0.01,
	CACHE_CHARGE_3000_BONUS_COIN: CACHE_CHARGE_PRD.CACHE_3000 * 0.03,
	CACHE_CHARGE_5000_BONUS_COIN: CACHE_CHARGE_PRD.CACHE_5000 * 0.05,
	CACHE_CHARGE_10000_BONUS_COIN: CACHE_CHARGE_PRD.CACHE_10000 * 0.1,
}

export const CACHE_CHARGE_PRD_NAME = {
	CACHE_1000: `코드룸 캐시 ${CACHE_CHARGE_PRD.CACHE_1000}+ 보너스 ${REWARD_COIN.CACHE_CHARGE_1000_BONUS_COIN} 코인`,
	CACHE_3000: `코드룸 캐시 ${CACHE_CHARGE_PRD.CACHE_3000}+ 보너스${REWARD_COIN.CACHE_CHARGE_3000_BONUS_COIN} 코인`,
	CACHE_5000: `코드룸 캐시 ${CACHE_CHARGE_PRD.CACHE_5000}+ 보너스${REWARD_COIN.CACHE_CHARGE_5000_BONUS_COIN} 코인`,
	CACHE_10000: `코드룸 캐시 ${CACHE_CHARGE_PRD.CACHE_10000}+ 보너스${REWARD_COIN.CACHE_CHARGE_10000_BONUS_COIN} 코인`,
}

