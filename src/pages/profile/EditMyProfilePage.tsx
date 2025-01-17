import React, {ChangeEvent, FC, useCallback, useRef, useState} from 'react';
import InfoLayout from '../../layout/InfoLayout';
import {FormWrapper} from './styles';
import {
    Avatar,
    Box,
    Button,
    Card,
    Divider,
    Stack,
    TextField,
    Typography,
    styled
} from '@mui/material';
import {useInputValidate} from '../../hooks/common/UseInputValidate';
import {REWARD_COIN} from '../../constants/define';
import {toast} from 'react-toastify';
import {useLocation, useNavigate} from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import {apiClient} from '../../api/ApiClient';
import {useMutation} from '@tanstack/react-query';
import {useQueryUserLogin} from '../../hooks/fetcher/UserFetcher';
import SectionTitle from './components/SectionTitle';
import UserProfileImage from '../../components/profile/UserProfileImage';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {CoinHistoryType} from '../../enums/CoinHistoryType';
import {UsersCoinHistoryReq} from '../../data/entity/UsersCoinHistoryReq';
import {UserModel} from "../../data/model/UserModel";
import {createTodayDate} from "../../utils/DayJsHelper";

interface Props {
    children?: React.ReactNode;
}

interface RouteState {
    state: {
        userData: UserModel;
    }
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const EditMyProfilePage: FC<Props> = () => {
    const {state} = useLocation() as RouteState;
    const {userLogin, isLoadingUserLogin} = useQueryUserLogin();
    const navigate = useNavigate();
    const inputEmailRef = useRef<HTMLInputElement | null>(null);

    const [inputIntroduce, onChangeInputIntroduce, , ,
        , successIntroduce, successIntroduceMsg,
        setErrIntroduce, setErrIntroduceMsg,
        , , inputIntroduceCount
    ] = useInputValidate({
        defaultValue: state.userData?.about_me!
    });

    const {mutateAsync: mutateSetProfilePoint} = useMutation({
        mutationFn: async () => {
            // 프로필 보상 코인 지급
            const totalPoint = await apiClient.getUserTotalPoint(userLogin?.user_token!);
            if (totalPoint) {
                const totalAmount = totalPoint + REWARD_COIN.PROFILE_IMG_BONUS_COIN;
                const pointHistory: UsersCoinHistoryReq = {
                    user_token: userLogin!.user_token!,
                    coin: REWARD_COIN.PROFILE_IMG_BONUS_COIN,
                    amount: totalAmount,
                    description: "프로필 사진 설정 보상",
                    coin_history_type: CoinHistoryType.earn_coin,
                }
                await apiClient.insertUserCoinHistory(pointHistory);
                await apiClient.updateTotalCoin(userLogin!.user_token!, totalAmount);

            } else {
                return false;
            }
        },
        onSuccess: async () => {
            await apiClient.setTrueUserProfileImageRewardStatus(userLogin?.user_token!);
            toast.success(`프로필 사진 설정 보상 ${REWARD_COIN.PROFILE_IMG_BONUS_COIN} 코인이 지급되었습니다.`);
        },
        onError: () => {
            toast.error('프로필 사진 설정 보상 코인 지급에 실패했습니다.');
        }
    });

    const {mutateAsync: mutateSetIntroducePoint} = useMutation({
        mutationFn: async () => {
            // 자기소개 보상 코인 지급
            const totalPoint = await apiClient.getUserTotalPoint(userLogin?.user_token!);
            if (totalPoint) {
                const totalAmount = totalPoint + REWARD_COIN.INTRODUCTION_BONUS_COIN;
                const pointHistory: UsersCoinHistoryReq = {
                    user_token: userLogin!.user_token!,
                    coin: REWARD_COIN.INTRODUCTION_BONUS_COIN,
                    amount: totalAmount,
                    description: "프로필 자기소개 작성 보상",
                    coin_history_type: CoinHistoryType.earn_coin,
                }
                await apiClient.insertUserCoinHistory(pointHistory);
                await apiClient.updateTotalCoin(userLogin?.user_token!, totalAmount);
            } else {
                return false;
            }
        },
        onSuccess: async () => {
            await apiClient.setTrueUserIntroduceRewardStatus(userLogin?.user_token!);
            toast.success(`프로필 자기소개 작성 보상 ${REWARD_COIN.INTRODUCTION_BONUS_COIN} 코인이 지급되었습니다.`);
        },
        onError: () => {
            toast.error('프로필 자기소개 작성 보상 코인 지급에 실패했습니다.');
        }
    });

    const {mutateAsync: mutate} = useMutation({
        mutationFn: async () => {
            if (file != null) { // 프로필 이미지 처리
                // upload 시 기존 사진 삭제
                await apiClient.deleteAllProfileImageInFolder(userLogin?.user_token!);

                const date = createTodayDate();
                const path: string = `profile/${userLogin?.user_token}/${date}`;
                const profileUrl = await apiClient.uploadImage(userLogin?.user_token!, file, path); // 이미지 스토리지 업로드
                await apiClient.updateImgUrl(userLogin?.user_token!,'users','profile_url', profileUrl);    // db update

                if (!userLogin?.is_profile_image_rewarded) {
                    await mutateSetProfilePoint();
                }
            }

            // db업데이트
            await apiClient.updateAboutMeData(userLogin?.user_token!, inputIntroduce);

            // 코인 지급
            if (inputIntroduce.length > 100 && !userLogin?.is_introduce_rewarded) {
                await mutateSetIntroducePoint();
            }
        },
        onSuccess: () => {
            toast.success('편집이 완료되었습니다.');
        },
        onError: (error) => {
            // Error handling
            console.error('Error updating profile:', error);
            toast.error('프로필 업데이트 중 오류가 발생했습니다.');
        },
    });

    const [src, setSrc] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);

    const handleChangeImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            const url = URL.createObjectURL(file);
            setFile(file);
            setSrc(url);
            setFileName(file.name);
        }
    }, []);

    const onSubmitRegisterForm = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await mutate();
            navigate('/profile/my');
        } catch (e) {
            console.error('Error submitting form:', e);
            toast.error('프로필 업데이트 중 오류가 발생했습니다.');
        }
    }, [inputIntroduce, mutate, navigate]);

    return (
        <MainLayout>
            <Card sx={{p: 3, backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: 2}}>
                <InfoLayout header={'프로필 수정하기'}>
                    <FormWrapper onSubmit={onSubmitRegisterForm} style={{marginTop: '24px'}}>
                        <Stack spacing={4}>
                            <Box>
                                <SectionTitle title='프로필 이미지' helpText='프로필 이미지를 설정하면 100 커밋 코인 증정'/>
                                <Box display="flex" alignItems="center" mt={2}>
                                    <Box>
                                        {userLogin && <UserProfileImage size={60} userId={userLogin.user_token!}/>}
                                        <Button
                                            component="label"
                                            variant="contained"
                                            startIcon={<CloudUploadIcon />}
                                            sx={{ mt: 2 }}
                                        >
                                            이미지 업로드
                                            <VisuallyHiddenInput type="file" onChange={handleChangeImage} accept="image/*" />
                                        </Button>
                                        {fileName && (
                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                선택된 파일: {fileName}
                                            </Typography>
                                        )}
                                    </Box>
                                    {src && (
                                        <>
                                            <ArrowForwardIosIcon style={{color: 'black', margin: '0 16px'}}/>
                                            <Avatar src={src} sx={{width: 100, height: 100}}/>
                                        </>
                                    )}
                                </Box>
                            </Box>
                            <Divider/>
                            <Box>
                                <SectionTitle title='이메일'/>
                                <Typography variant="body1" color="textSecondary"
                                            mt={2}>{state.userData?.email}</Typography>
                            </Box>
                            <Divider/>
                            <Box>
                                <SectionTitle title='닉네임'/>
                                <Typography variant="body1" color="textSecondary"
                                            mt={2}>{state.userData?.nickname}</Typography>
                            </Box>
                            <Divider/>
                            <Box>
                                <SectionTitle title='자기소개' helpText='구매자들에게 자신을 소개해보세요. 소개 작성 시 500 커밋 코인 증정'/>
                                <TextField
                                    value={inputIntroduce}
                                    onChange={onChangeInputIntroduce}
                                    placeholder='예: 안녕하세요, 10년차 안드로이드 개발자입니다.'
                                    inputRef={inputEmailRef}
                                    autoComplete='off'
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                    sx={{mt: 2}}
                                />
                                <Typography variant="body2" color="textSecondary" align="right">
                                    ({inputIntroduceCount}/1,000)
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button type="submit" variant="contained" color="primary"
                                        sx={{fontSize: '16px', fontWeight: 'bold'}}>
                                    편집 완료
                                </Button>
                            </Box>
                        </Stack>
                    </FormWrapper>
                </InfoLayout>
            </Card>
            <Box height={64}/>
        </MainLayout>
    );
};

export default EditMyProfilePage;