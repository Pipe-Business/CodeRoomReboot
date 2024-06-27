import React, {FC, useCallback, useRef, useState} from "react";
import MainLayout from "../../layout/MainLayout";
import {Box, Card, CardHeader, IconButton, Paper, TextField, Typography, CardContent, Skeleton} from '@mui/material';
import {ArrowBack} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";
import useInput from "../../hooks/UseInput";
import {ColorButton} from "./styles";
import {CodeModel} from "../../data/model/CodeModel";
import {calcTimeDiff} from "../../utils/DayJsHelper";
import {CATEGORY_TO_KOR, REACT_QUERY_KEY} from "../../constants/define";
import ReadMeHtml from "../codeInfo/components/ReadMeHtml";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../api/ApiClient";
import {useQueryUserLogin} from "../../hooks/fetcher/UserFetcher";

interface Props {
    children?: React.ReactNode;
    onPaymentConfirm: () => void
}

const PaymentPage: FC<Props> = ({onPaymentConfirm}) => {
    const { userLogin } = useQueryUserLogin();

    const navigate = useNavigate();
    const location = useLocation();
    const postData: CodeModel = location.state?.postData;

    const inputCashRef = useRef<HTMLInputElement | null>(null);
    const [inputCash, , setCash] = useInput<number>(0);
    const [cashError, setCashError] = useState(false);
    const [inputCoin, , setCoin] = useInput<number>(0);
    const [coinError, setCoinError] = useState(false);
    const inputCoinRef = useRef<HTMLInputElement | null>(null);
    const [paymentRequiredAmount, setPaymentRequiredAmount] = useState<number>(postData?.price ?? 0);

    const { isLoading: isReadMeLoading, data: readMeData } = useQuery({
        queryKey: ['readme',postData?.id],
        queryFn: () => apiClient.getReadMe(postData!.adminGitRepoURL),
    });
    const { isLoading: isCashDataLoading, data: cashData } = useQuery({
        queryKey: [REACT_QUERY_KEY.cash],
        queryFn: () => apiClient.getUserTotalCash(userLogin?.user_token!),
    });
    const { isLoading: isCoinDataLoading, data: coinData } = useQuery({
        queryKey: [REACT_QUERY_KEY.point],
        queryFn: () => apiClient.getUserTotalPoint(userLogin?.user_token!),
    });

    const onSetPaymentRequiredAmount = useCallback((cash:number, coin:number) => {
        let totalAmount: number = postData.price! - cash - coin;
        if(totalAmount < 0) resetInput();
        setPaymentRequiredAmount(totalAmount);
    }, [inputCash, inputCoin]);

    const onUseAllCash = () => {
        UseAll(inputCash,inputCoin, cashData!, setCash);
    }

    const onUseAllCoin = () => {
        UseAll(inputCoin,inputCash, coinData!, setCoin);
    }

    const UseAll = useCallback((currentInput : number , otherInput : number,currentMoney: number, setFunc: Function) => {
        let total;

        if(otherInput === 0){ // 다른 입력필드를 입력하지 않은 경우
            total  = 0;
            if(currentMoney! > postData.price){ // 보유긍맥 > 게시글 가격
                total = postData.price; // 금액 = 게시글 가격
            }else{ // 보유금액 < 가격
                total =  currentMoney!; // 금액 = 보유금액
            }

        } else{ // 다른 입력필드를 입력한 경우
            total = currentInput;
            if(currentMoney! > paymentRequiredAmount){ // 보유긍맥 > 게시글 가격
                total = total + paymentRequiredAmount; // 금액 = 기존 금액 + 남은 결제 필요금액
            }else{ // 보유금액 < 게시글 가격
                total = currentMoney!; // 금액 = 보유금액
            }
        }

        if(total < 0 ) total = 0;

        setFunc(total);
        onSetPaymentRequiredAmount(otherInput, total);

    }, [inputCash, inputCoin])

    const resetInput = useCallback(() => {
        setCash(0);
        setCoin(0);
        setPaymentRequiredAmount(0);
    },[]);

    const onChangeCash = useCallback((e: any) => {
        let value: number = parseInt(e.target.value);
        if(value > cashData!) value = cashData!;
        if(value < 0) value = 0;
        if(value > postData.price!) value = postData.price!;
        if(inputCoin){
            let remainPrice = postData.price - inputCoin;
            if(value > remainPrice) value = remainPrice;
        }

        setCash(value);
        onSetPaymentRequiredAmount(value,inputCoin);

        if (e.target.value < 0) {
            setCashError(true);
        } else {
            setCashError(false);
        }
       // console.log(inputCash);


    }, [inputCash]);

    const onChangeCoin = useCallback((e: any) => {
        let value = parseInt(e.target.value);
        if(value > coinData!) value = coinData!; // 입력값 > 보유금액 -> 입력값 = 보유금액
        if(value > postData.price!) value = postData.price!;
        if(value < 0) value = 0;

        if(inputCash){
            let remainPrice = postData.price - inputCash;
            if(value > remainPrice) value = remainPrice;
        }

        setCoin(value);
        onSetPaymentRequiredAmount(inputCash,value);

        if (e.target.value < 0) {
            setCoinError(true);
        } else {
            setCoinError(false);
        }
        //console.log(inputCoin);


    }, [inputCoin]);

    const onClickBackButton = useCallback(() => {
        navigate(-1);
    }, []);

    const onClickPurchase = () => {
        const result = window.confirm(`결제하시겠습니까?\n${inputCash} 캐시 사용\n${inputCoin} 코인 사용\n추가결제 : ${paymentRequiredAmount}`);
        if (result) {
            onPaymentConfirm();
        }
    }

    if(isCashDataLoading || isCoinDataLoading){
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, width: { xs: '100%', md: '850px' }, mx: 'auto' }}>
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <Box height={32}/>
            <div style={{display:'flex', flexDirection:'row'}}>
            <Card
                elevation={2}
                sx={{
                    width: { xs: '70%', md: '%' },
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: { xs: 2, md: 0 },
                }}
            >
                <CardHeader
                    avatar={
                        <IconButton onClick={onClickBackButton}>
                            <ArrowBack sx={{ fontSize: '32px' }} />
                        </IconButton>
                    }
                    title={
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                            결제하기
                        </Typography>
                    }
                />
                <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    {calcTimeDiff(postData.createdAt)}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    조회수: {postData.viewCount}
                </Typography>
                <Box my = {2}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        제목
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                        {postData.title}
                    </Typography>
                </Box>
                <Box my={2}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        카테고리
                    </Typography>
                    <Typography variant="body1" color="textPrimary">
                        {postData.postType} / {CATEGORY_TO_KOR[postData.category as keyof typeof CATEGORY_TO_KOR]} / {postData.language}
                    </Typography>
                </Box>
                <Box my={2}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        코드 설명
                    </Typography>
                    <div>
                        <ReadMeHtml htmlText={readMeData!}/>
                    </div>
                </Box>

                </CardContent>
            </Card>

                <Box width="16px"/>

                <Paper
                    elevation={0}
                    sx={{ width: { xs: '30%', md: '%' },}}>
            <Card
                elevation={2}
                sx={{
                    width: { xs: '100%', md: '%' },
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: { xs: 2, md: 0 },
                }}
            >
                <CardHeader
                    title={
                        <Typography variant="body1" component="div" sx={{ color: '#333' }} style={{fontWeight: 'bold'}}>
                            구매자 정보
                        </Typography>
                    }
                />

                <section style={{marginLeft: '16px'}}>

                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Typography variant="body1" component="div" sx={{color: '#C2C6C9'}}
                                    style={{fontWeight: 'bold',}}>
                            이름
                        </Typography>
                        <Box width={'16px'}/>
                        <Typography variant="body1" component="div" sx={{color: '#333'}}>
                            {userLogin?.nickname}
                        </Typography>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Typography variant="body1" component="div" sx={{color: '#C2C6C9'}}
                                    style={{fontWeight: 'bold',}}>
                            이메일
                        </Typography>
                        <Box width={'16px'}/>
                        <Typography variant="body1" component="div" sx={{color: '#333'}}>
                            {userLogin?.email}
                        </Typography>
                    </div>

                    <Box height={'16px'}/>

                </section>

            </Card>
                    <Box height={16}/>
                    <Card
                        elevation={2}
                        sx={{
                            width: {xs: '100%', md: '%'},
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: {xs: 2, md: 0},
                        }}
                    >
                        <div style={{display: 'flex', justifyContent: 'end', padding: '16px'}}>
                        <ColorButton onClick={resetInput} variant={'contained'} style={{width:'100%'}}>입력 값 초기화</ColorButton>
                        </div>

                        <Box height={16}/>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft:'16px', marginRight:'8px'}}>
                            <Typography variant="body1" component="div" sx={{color: '#333'}}
                                        style={{fontWeight: 'bold'}}>
                                캐시
                            </Typography>
                            <Typography variant="body2" component="div" sx={{color: '#333'}}
                                        style={{fontWeight: 'bold'}}>
                                {cashData} 보유
                            </Typography>

                        </div>

                        <Box height={8}/>

                        <div style={{ display:'flex', marginLeft:'16px', flexDirection:'row'}}>
                        <TextField
                            sx={{
                                width: { lg: 196 },
                                "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                                    WebkitAppearance: "none",
                                    margin: 0,
                                },
                                "input[type=number]": {
                                    MozAppearance: "textfield",
                                },
                            }}
                            value={inputCash} onChange={onChangeCash}
                            placeholder={''}
                            inputRef={inputCashRef}
                            error={cashError}
                            helperText={cashError && '캐시는 음수가 될수 없습니다.'}
                            type='number'
                            inputProps={{inputProps:{min: 0, max: cashData}}}
                        />
                            <Box width={16}/>
                            <ColorButton onClick={onUseAllCash} variant={'contained'}>전액사용</ColorButton>

                        </div>

                        <Box height={16}/>

                        <Box height={16}/>
                        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginLeft:'16px', marginRight:'8px'}}>
                            <Typography variant="body1" component="div" sx={{color: '#333'}}
                                        style={{fontWeight: 'bold'}}>
                                코인
                            </Typography>
                            <Typography variant="body2" component="div" sx={{color: '#333'}}
                                        style={{fontWeight: 'bold'}}>
                                {coinData} 보유
                            </Typography>

                        </div>

                        <Box height={8}/>

                        <div style={{ display:'flex', marginLeft:'16px', flexDirection:'row'}}>
                            <TextField
                                sx={{
                                    width: { lg: 196 },
                                    "input::-webkit-outer-spin-button, input::-webkit-inner-spin-button": {
                                        WebkitAppearance: "none",
                                        margin: 0,
                                    },
                                    "input[type=number]": {
                                        MozAppearance: "textfield",
                                    },
                                }}
                                value={inputCoin} onChange={onChangeCoin}
                                placeholder={''}
                                inputRef={inputCoinRef}
                                error={coinError}
                                helperText={coinError && '코인은 음수가 될수 없습니다.'}
                                type='number'
                                inputProps={{inputProps:{min: 0, max: coinData}}}
                            />
                            <Box width={16}/>
                            <ColorButton onClick={onUseAllCoin} variant={'contained'}>전액사용</ColorButton>

                        </div>


                        <CardContent>
                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Typography variant="body1" component="div" sx={{color: '#C2C6C9'}}
                                            style={{fontWeight: 'bold',}}>
                                    선택 상품 금액
                                </Typography>

                                <Typography variant="body1" component="div" sx={{color: '#333'}}>
                                    {postData.price}
                                </Typography>

                            </div>

                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Typography variant="body1" component="div" sx={{color: '#E96B5A'}}
                                            style={{fontWeight: 'bold',}}>
                                    캐시
                                </Typography>

                                <Typography variant="body1" component="div" sx={{color: '#333'}}>
                                    - {inputCash}
                                </Typography>

                            </div>

                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Typography variant="body1" component="div" sx={{color: '#E96B5A'}}
                                            style={{fontWeight: 'bold',}}>
                                    코인
                                </Typography>

                                <Typography variant="body1" component="div" sx={{color: '#333'}}>
                                    - {inputCoin}
                                </Typography>

                            </div>

                            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Typography variant="body1" component="div" sx={{color: '#3C3F41'}}
                                            style={{fontWeight: 'bold',}}>
                                    차액 결제 필요 금액
                                </Typography>

                                <Typography variant="body1" component="div" sx={{color: '#333'}}>
                                    {paymentRequiredAmount}
                                </Typography>

                            </div>

                            <Box height={32}/>
                            <ColorButton onClick={onClickPurchase} variant={'contained'} style={{width:"100%"}}>결제하기</ColorButton>

                        </CardContent>


                    </Card>
                </Paper>
            </div>
        </MainLayout>
    );
}
export default PaymentPage;