import {SupabaseAuthAPI} from "./supabase/SupabaseAuthAPI";
import {createClient, User} from '@supabase/supabase-js'
import {CodeModel} from "../data/model/CodeModel";
import {UserEntity} from "../data/entity/UserEntity";
import {API_ERROR} from "../constants/define";
import {UserModel} from "../data/model/UserModel";
import {GithubForkURLEntity} from "../data/entity/GithubForkURLEntity";
import axios from 'axios';
import {serverURL} from '../hooks/fetcher/HttpFetcher';
import {useOctokit} from "../index";
import {NotificationEntity} from "../data/entity/NotificationEntity";
import {NotificationType} from '../enums/NotificationType';
import {UsersCoinHistoryReq} from "../data/entity/UsersCoinHistoryReq";
import {BootPayPaymentModel} from "../data/entity/BootPayPaymentModel";
import {PurchaseReviewEntity} from "../data/entity/PurchaseReviewEntity";
import {AdminUserManageEntity} from "../data/entity/AdminUserManageEntity";
import {MainPageCodeListEntity} from "../data/entity/MainPageCodeListEntity";
import {CodeReviewRequestEntity} from "../data/entity/CodeReviewRequestEntity";
import {PostRequestEntity} from "../data/entity/PostRequestEntity";
import {CodeRequestEntity} from "../data/entity/CodeRequestEntity";
import {PurchaseSaleReq} from "../data/entity/PurchaseSaleReq";
import {PurchaseSaleRes} from "../data/entity/PurchaseSaleRes";
import {LikeRequestEntity} from "../data/entity/LikeRequestEntity";
import {LikeResponseEntity} from "../data/entity/LikeResponseEntity";
import {UsersCoinHistoryRes} from "../data/entity/UsersCoinHistoryRes";
import {CodeEditRequestEntity} from "../data/entity/CodeEditRequestEntity";
import {createTodayDate} from "../utils/DayJsHelper";
import {UsersAmountModel} from "../data/entity/UsersAmountModel";
import {PostStateType} from "../enums/PostStateType";
import {GptCodeInfoResponseEntity} from "../data/entity/GptCodeInfoResponseEntity";
import { Octokit } from "@octokit/rest";
import {toast} from "react-toastify";

export const supabase = createClient(process.env.REACT_APP_SUPABASE_URL!, process.env.REACT_APP_SUPABASE_KEY! );

const updateImageUrls = (readmeContent: string, owner: string, repo: string, token: string) => {
    const imageUrlPattern = /!\[.*?\]\((.*?)\)/g;
    return readmeContent.replace(imageUrlPattern, (match, p1) => {
        // const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${p1}`;
        // const authenticatedUrl = `${apiUrl}?access_token=${token}`;
        const apiUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${p1}`;
        const authenticatedUrl = `${apiUrl}?token=${token}`;
        return match.replace(p1, authenticatedUrl);
    });
};


class ApiClient implements SupabaseAuthAPI {
    constructor(
        private readonly auth = supabase.auth,
    ) {
    }

    async loginWithEmail(email: string, password: string): Promise<User | Boolean> {
        try {
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
            if (data.user == null) {
                console.log(error?.message);
                console.log(error?.stack);
                console.log(false);
                return false;
            }
            return data.user;

        } catch (e: any) {
            console.log(e);
            throw new Error('비밀번호가 정확하지 않습니다.');
        }
    }

    async signOut() {
        try {
            const {error} = await supabase.auth.signOut();
        } catch (e: any) {
            console.log(e);
            throw new Error('로그아웃에 실패했습니다.');
        }
    }

    async getAllCode(): Promise<MainPageCodeListEntity[]> {
        try {
            const {data, error} = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('state', PostStateType.approve)
                .eq('is_deleted', false) // 삭제된 게시글은 메인에서 안보이도록 처리
                .order('created_at', {ascending: false});


            let lstCodeModel: MainPageCodeListEntity[] = [];
            if (data) {
                for (const e of data) {
                    const likedCount: number = await this.getTargetPostLikedNumber(e.id);
                    const reviewCount: number = await this.getPurchaseReviewsCount(e.id);


                    let codeModel: MainPageCodeListEntity = {
                        id: e.id,
                        title: e.title,
                        description: e.description,
                        images: e.images,
                        code_price: e.code.code_price,
                        userToken: e.user_token,
                        category: e.category,
                        language: e.code.language,
                        postType: e.post_type,
                        createdAt: e.created_at,
                        aiSummary: e.code.ai_summary,
                        githubRepoUrl: e.code.github_repo_url,
                        buyerCount: e.code.buyer_count,
                        popularity: e.code.popularity,
                        hashTag: e.hash_tag,
                        sellerGithubName: e.code.seller_github_name,
                        state: e.state,
                        adminGitRepoURL: e.code.admin_git_repo_url,
                        rejectMessage: e.reject_message,
                        viewCount: e.view_count,
                        likeCount: likedCount,
                        reviewCount: reviewCount,
                        is_deleted: e.is_deleted,
                    }
                    lstCodeModel.push(codeModel);
                }
            }

            //console.log(data);
            return lstCodeModel;
        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 목록을 가져오는 데 실패했습니다.');
        }

    }

    async resetPasswordByEmail(email: string) {
        try {
            const {data, error} = await supabase.auth
                //.resetPasswordForEmail(email, { redirectTo: 'http://localhost:3000/change-password' });
                .resetPasswordForEmail(email, {redirectTo: 'https://main--coderoom-io.netlify.app/reset-password'});
        } catch (e: any) {
            console.log(e);
            throw new Error('비밀번호 재설정에 실패했습니다.');
        }
    }

    async signUpByEmail(email: string, password: string): Promise<User> {
        try {
            const {data, error} = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            console.log(data);
            if (error) {
                throw new Error(API_ERROR.USER_ALREADY_REGISTERED);
            }
            return data.user!;
        } catch (e: any) {
            console.log(e);
            if (e) {
                throw new Error(API_ERROR.USER_ALREADY_REGISTERED);

            }
            throw new Error('이메일 회원가입에 실패하였습니다.');
        }
    }

    async insertUserData(user: UserEntity) {
        try {

            const userData = {
                "auth_type": user.authType,
                "email": user.email,
                "name": user.name,
                "nickname": user.nickname,
                "profile_url": user.profileUrl,
                "about_me": user.aboutMe,
                "is_profile_image_rewarded": user.is_profile_image_rewarded,
                "is_introduce_rewarded": user.is_introduce_rewarded,
                "user_token": user.userToken,
            }
            console.log("회원가입 할 유저: "+JSON.stringify(userData));

            const {data, error} = await supabase.from('users')
                .insert(userData);
            if (error) {
                console.log(JSON.stringify(error))

                throw new Error('회원정보 저장에 실패하였습니다.');
            }


        } catch (e: any) {
            console.log(e);
            throw new Error('회원정보 저장에 실패하였습니다.');
        }
    }

    async updateUserPassword(newPassword: string) {
        try {
            const {data, error} = await supabase.auth
                .updateUser({password: newPassword});
            console.log(data);
        } catch (e: any) {
            console.log(e);
            throw new Error('비밀번호 업데이트에 실패했습니다.');
        }

    }

    async getCurrentLoginUser(): Promise<User> {
        try {
            const {data, error} = await supabase.auth.getUser();
            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);

                throw new Error('유저 정보를 가져오는데 실패하였습니다.');
            }
            return data.user;
        } catch (e: any) {
            console.log(e);
            throw new Error('유저 정보를 가져오는데 실패하였습니다.');
        }
    }


    async insertCodeReviewHistory(codeReview: CodeReviewRequestEntity) {
        console.log("codeReview: " + {...codeReview});

        try {
            const {error} = await supabase.from('codereview_request_history').insert(codeReview);
            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('코드리뷰 신청내역 저장에 실패하였습니다.');
            }
        } catch (e: any) {
            console.log(e);
            throw new Error('코드리뷰 신청내역 저장에 실패하였습니다.');
        }
    }

    async insertImgUrl(postId: number, imageUrls: string[]) {
        try {
            const {error} = await supabase.from('post')
                .update({img_urls: imageUrls}).eq('id', postId);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('이미지 링크 저장에 실패하였습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('이미지 링크 저장에 실패하였습니다.');
        }
    }

    async getLastMyNotifications(userToken: string): Promise<NotificationEntity[]> {
        // 현재 로그인한 계정의 마지막까지 저장되어있었던 알림 목록 가져오기
        try {
            const {data, error} = await supabase.from('notification')
                .select()
                .eq('to_user_token', userToken)
                .order('created_at', {ascending: false});

            let lstNotifications: NotificationEntity[] = [];
            data?.forEach((e) => {
                let notificationData: NotificationEntity = {
                    id: e.id,
                    title: e.title,
                    content: e.content,
                    to_user_token: e.to_user_token,
                    from_user_token: e.from_user_token,
                    notification_type: e.notification_type,
                    created_at: e.created_at,
                }
                lstNotifications.push(notificationData);
            });

            if (error) {
                console.log("error" + error.message);
                // console.log("error" + error.name);
                // console.log("error" + error.stack);

                throw new Error('알림목록을 가져오는 도중 실패하였습니다.');
            }
            return lstNotifications;
        } catch (e: any) {
            console.log(e);
            throw new Error('알림목록을 가져오는 도중 실패하였습니다.');
        }

    }

    async subscribeInsertNotification(handleInserts: Function) {
        // Listen to inserts for notification table

        supabase
            .channel('notification')
            // @ts-ignore
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notification'
            }, handleInserts)
            .subscribe()
    }

    async getImgPublicUrl(path: string): Promise<string> {
        try {
            const {data} = supabase
                .storage
                .from('coderoom')
                .getPublicUrl(path);
            console.log("publicurl: " + data.publicUrl);
            return data.publicUrl;
        } catch (e: any) {
            console.log(e);
            throw new Error('이미지 주소 다운에 실패했습니다.')   ;
        }
    }

    async uploadImages(userToken: string, postId: number, files: File[]): Promise<string[]> {
        try {

            const lstPublicUrl: string[] = [];

            for (const file of files) {

                const path: string = `boards/code/${userToken}_${postId}_${file.name}`;

                const {data, error} = await supabase
                    .storage
                    .from('coderoom')
                    .upload(path, file);
                const publicUrl = await this.getImgPublicUrl(path);
                lstPublicUrl.push(publicUrl);

                if (error) {
                    console.log("error" + error.message);
                    console.log("error" + error.name);
                    console.log("error" + error.stack);

                    throw new Error('이미지 저장에 실패했습니다.');
                }
            }

            return lstPublicUrl;

        } catch (e: any) {
            console.log(e);
            throw new Error('이미지 저장에 실패했습니다.');
        }
    }

    async deleteUnselectedImg(lstDeleteImg: string[]) {
        try {
            const lstDeleteImgName: string[] = [];
            for (const url of lstDeleteImg) {
                console.log("삭제될 이미지 경로: " + JSON.stringify(url));
                const imageName = url.split('coderoom/'); // https:~~형태로 시작하는 문자열을 split
                lstDeleteImgName.push(imageName[1]);
            }
            //console.log("삭제될 이미지 이름: "+JSON.stringify(lstDeleteImgName));

            await supabase.storage.from('coderoom').remove(lstDeleteImgName);


        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 수정 중 이미지 삭제에 실패했습니다.');
        }
    }

    async insertPostData(post: PostRequestEntity): Promise<number> {
        try {
            const {data, error} = await supabase.from('post')
                .insert(post).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글 업로드에 실패하였습니다.');
            }
            //const postString:string = JSON.stringify(data);

            let postId: number = -1;

            data.map((e) => {
                postId = e.id;
            });

            console.log("this is post: " + postId.toString());
            return postId;

        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 업로드에 실패하였습니다.');
        }
    }

    async insertCodeData(post: CodeRequestEntity) {
        try {
            const {data, error} = await supabase.from('code')
                .insert(post).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글(코드) 업로드에 실패하였습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('게시글(코드) 업로드에 실패하였습니다.');
        }
    }

    async getTargetCode(postId: number): Promise<CodeModel> {
        try {
            const {data, error} = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('id', postId);

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.img_urls,
                    price: e.code.code_price,
                    userToken: e.user_token,
                    aiSummary: e.code.ai_summary,
                    language: e.code.language,
                    category: e.category,
                    createdAt: e.created_at,
                    postType: e.post_type,
                    popularity: e.code.popularity,
                    buyerCount: e.code.buyer_count,
                    hashTag: e.hash_tag,
                    state: e.state,
                    sellerGithubName: e.code.seller_github_name,
                    githubRepoUrl: e.code.github_repo_url,
                    reviewResultMsg: e.review_result_msg,
                    viewCount: e.view_count,
                    adminGitRepoURL: e.code.admin_git_repo_url,
                    isDeleted: e.is_deleted,
                }
                lstCodeModel.push(codeModel);
            });
            //console.log("target"+data);

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
            }

            return lstCodeModel[0];
        } catch (e: any) {
            console.log(e);
            throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
        }

    }

    async getTargetUser(targetUserToken: string): Promise<UserModel> { // userModel만들기
        try {
            const {data, error} = await supabase.from('users')
                .select('*')
                .eq('user_token', targetUserToken);

            let lstUserModel: UserModel[] = [];
            data?.forEach((e) => {
                let userModel: UserModel = {
                    id: e.id,
                    auth_type: e.auth_type,
                    email: e.email,
                    name: e.name,
                    nickname: e.nickname,
                    profile_url: e.profile_url,
                    about_me: e.about_me,
                    contacts: e.contacts,
                    user_token: e.user_token,
                    is_introduce_rewarded: e.is_introduce_rewarded,
                    is_profile_image_rewarded: e.is_profile_image_rewarded,
                    created_at: e.created_at,
                }
                lstUserModel.push(userModel);
            });
            //console.log("userModel" + JSON.stringify(data));

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
            }

            return lstUserModel[0];
        } catch (e: any) {
            console.log(e);
            throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
        }

    }

    async getUserTotalCash(myUserToken: string): Promise<number> {
        try {
            const {data, error} = await supabase.from('users_amount')
                .select('*')
                .eq('user_token', myUserToken);

            const stringdata = JSON.stringify(data);
            //console.log("getUserTotalCash: "+stringdata);

            if (!data || data.length === 0) {
                return 0;  // 데이터가 없는 경우 합산 캐시는 0으로 반환
            }

            let userAmountEntity: UsersAmountModel = {
                id: data[0].id,
                user_token: data[0].user_token,
                coin_amount: data[0].coin_amount,
            }
            // let cashEntity: CashHistoryResponseEntity = {
            //     id: data[0].id,
            //     user_token: data[0].user_token,
            //     cash: data[0].cash,
            //     amount: data[0].amount,
            //     description: data[0].description,
            //     cash_history_type: data[0].cash_history_type,
            //     created_at: data[0].created_at,
            // }
            // const totalCash: number = cashEntity.amount;
            return userAmountEntity.coin_amount;


        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 합산 캐시를 가져오는 데 실패했습니다.');
        }
    }


    async insertPurchaseSaleHistory(purchaseSaleRequestEntity: PurchaseSaleReq){
        console.log("결과: "+JSON.stringify(purchaseSaleRequestEntity));
        try {
            const {data, error} = await supabase.from('purchase_sale_history')
                .insert(purchaseSaleRequestEntity).select();
            if (error) {
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('코드 거래 기록을 insert 하는데 실패했습니다.');
            }
            //console.log(...data);
        } catch (e: any) {
            console.log(e);
            throw new Error('코드 거래 기록을 insert 하는데 실패했습니다.');
        }
    }

    async updateBuyerCount(buyerCount: number, postId: number) {
        try {
            const {error} = await supabase.from('code')
                .update({buyer_count: buyerCount}).eq('post_id', postId);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('구매자수 업데이트에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('구매자수 업데이트에 실패했습니다.');
        }
    }

    async updateViewCount(postId: number) {
        try {

            const codeData: CodeModel = await apiClient.getTargetCode(Number(postId!));

            const {error} = await supabase.from('post')
                .update({view_count: codeData.viewCount + 1}).eq('id', postId);
            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('조회수 증가에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('조회수 증가에 실패했습니다.');
        }
    }

    async getMyPurchaseSaleHistoryByPostID(myUserToken: string, postId: number): Promise<PurchaseSaleRes | null> {
        try {
            const {data, error} = await supabase.from('purchase_sale_history')
                .select('*')
                .eq('purchase_user_token', myUserToken)
                .eq('post_id', postId);

            let lstPurchaseSale: PurchaseSaleRes[] = [];
            data?.forEach((e) => {
                let purchaseSale: PurchaseSaleRes = {
                    id: e.id,
                    post_id: e.post_id,
                    sell_price: e.sell_price,
                    use_cash: e.use_cash,
                    is_confirmed: e.is_confirmed,
                    purchase_user_token: e.purchase_user_token,
                    bootpay_payment_id: e.bootpay_payemnt_id,
                    sales_user_token: e.sales_user_token,
                    pay_type: e.pay_type,
                    created_at: e.created_at,
                }
                lstPurchaseSale.push(purchaseSale);
            });
            //console.log("구매내역" + { ...data });

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('구매기록을 가져오는 데 실패했습니다.');
            }

            return lstPurchaseSale.length !== 0 ? lstPurchaseSale[0] : null;
        } catch (e: any) {
            console.log(e);
            throw new Error('구매기록을 가져오는 데 실패했습니다.');
        }
    }

    async getCodeDownloadURL(userName: string, repoName: string, branchName: string): Promise<GithubForkURLEntity> {

        try {
            console.log("getCodeDownloadURL : " + userName + repoName + branchName);
            const result = await axios.get<GithubForkURLEntity>(`${serverURL}/download/${userName}/${repoName}/${branchName}`);
            return result.data;
        } catch (e: any) {
            console.log(e);
            throw new Error('code download error');
        }


    }

    async getReadMe(adminGithubRepoUrl: string): Promise<string> {
        try {
            const split = adminGithubRepoUrl.split('/');
            const userName = split[split.length - 2];
            const repoName = split[split.length - 1];

            const result = await axios.get<any>(`${serverURL}/readme/${userName}/${repoName}`);
            //console.log(`readme result : ${result.data}`)
            // Base64로 인코딩된 데이터를 가져옵니다.
            // const base64Content = result.data.content;

            // Base64 문자열을 디코딩합니다.
            // const binaryString = atob(base64Content);

            // binary string을 Uint8Array로 변환합니다.
            // const bytes = new Uint8Array(binaryString.length);
            // for (let i = 0; i < binaryString.length; i++) {
            //     bytes[i] = binaryString.charCodeAt(i);
            // }

            // TextDecoder를 사용하여 UTF-8로 디코딩합니다.
            // const decoder = new TextDecoder('utf-8');
            // const decodedString = decoder.decode(bytes);
            // // console.log(`result markdown string : ${decodedString}`)
            // const updatedReadme = updateImageUrls(result.data, userName, repoName, process.env.REACT_APP_GITHUB_TOKEN!);
            // console.log(`result markdown string : ${updatedReadme}`)
            return result.data;
        } catch (e: any) {
            console.log(e);
            throw new Error('get readme error');
        }
    }

    async makeReadMeByGpt(adminGithubRepoUrl: string):Promise<string> {

        try {
            const split = adminGithubRepoUrl.split('/');
            const userName = split[split.length - 2];
            const repoName = split[split.length - 1];
            console.log("adminGithubrepo:+ "+adminGithubRepoUrl);
            const result = await axios.post<any>(`${serverURL}/gpt/makereadme/${userName}/${repoName}`);
            console.log("readmesldf: "+JSON.stringify(result.data.gptReadme));

            return result.data.gptReadme;
        } catch (e: any) {
            console.log(e);
            throw new Error('makeReadMeByGpt error');
        }
    }

    async refactoringByGpt(targetCode:string):Promise<string> {

        try {
            const result = await axios.post<any>(`${serverURL}/gpt/refactoring`, {data:targetCode});

            return result.data.refactorResult;
        } catch (e: any) {
            console.log(e);
            throw new Error('refactoring by gpt error');
        }
    }

    async riskRefactoringByGpt(targetCode:string):Promise<string> {

        try {
            const result = await axios.post<any>(`${serverURL}/gpt/refactoring/risk`, {data: targetCode});
            return result.data.refactorResult;
        } catch (e: any) {
            console.log(e);
            throw new Error('refactoring by gpt error');
        }
    }

    async makeCodeInfoBygpt(targetCode:string):Promise<GptCodeInfoResponseEntity> {
        try {
            const result = await axios.post<any>(`${serverURL}/gpt/recommand/codeInfo`, {data:targetCode});

            return {
                defaultInfo: result.data.defaultInfo,
                aiSummary: result.data.aiSummary,
                readMe: result.data.readMe,
                hashTag: result.data.hashTag,
            }
        } catch (e: any) {
            console.log(e);
            throw new Error('recommand title by gpt error');
        }
    }
    ///gpt/serviceplanning
    async servicePlanningByGpt():Promise<string[]> {

        try {
            const result = await axios.get<any>(`${serverURL}/gpt/serviceplanning`,);
            const resultList:string[] =result.data.servicePlanningResult.split(',,');

            return resultList;
        } catch (e: any) {
            console.log(e);
            throw new Error('service planning by gpt error');
        }
    }

    async makeServicePlanningDocumentPromptListByGpt(document:string):Promise<string[]> {

        try {
            const result = await axios.post<any>(`${serverURL}/gpt/serviceplanning/document/makeprompt`, {data:document});
            const resultList:string[] =result.data.serviceDocumentPrompt.split(',,');
            console.log(resultList);
            console.log("prompt1: "+typeof resultList);

            return resultList;
        } catch (e: any) {
            console.log(e);
            throw new Error('service planning document prompt list by gpt error');
        }
    }


    updateImageUrls = (readmeContent: string, owner: string, repo: string, token: string) => {
        const imageUrlPattern = /!\[.*?\]\((.*?)\)/g;
        return readmeContent.replace(imageUrlPattern, (match, p1) => {
            const absoluteUrl = `https://raw.githubusercontent.com/${owner}/${repo}/main/${p1}`;
            const authenticatedUrl = `${absoluteUrl}?access_token=${token}`;
            return match.replace(p1, authenticatedUrl);
        });
    };

    async insertReadme(postId: string, readme: string) {
        try {

            const {error} = await supabase.from('post')
                .update({description: readme})
                .eq('id', postId);


            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('readme insert에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('readme insert에 실패했습니다.');
        }
    }



    async insertLikedData(likedData: LikeRequestEntity) { // 좋아요 insert
        try {
            const {error} = await supabase.from('liked')
                .insert(likedData).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('좋아요 insert에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('좋아요 insert에 실패했습니다.');
        }
    }

    async getLikeData(myUserToken: string, postId: number): Promise<LikeResponseEntity | null> {
        try {
            const {data, error} = await supabase.from('liked')
                .select('*')
                .eq('user_token', myUserToken)
                .eq('post_id', postId);

            let lstLikeResponseEntity: LikeResponseEntity[] = [];
            data?.forEach((e) => {
                let likeData: LikeResponseEntity = {
                    id: e.id,
                    created_at: e.created_at,
                    user_token: e.user_token,
                    post_id: e.post_id,
                }
                lstLikeResponseEntity.push(likeData);
            });

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('좋아요 데이터를 가져오는데 실패했습니다.');
            }
            //console.log("sdfsdfsdfsdfsdfsdfsdfsdf" + lstLikeResponseEntity.length.toString());

            return lstLikeResponseEntity.length != 0 ? lstLikeResponseEntity[0] : null;
        } catch (e: any) {
            console.log(e);
            throw new Error('좋아요 데이터를 가져오는데 실패했습니다.');
        }
    }

    async deleteLikeData(userToken: string, postId: number) {
        try {
            const {error} = await supabase
                .from('liked')
                .delete()
                .eq('post_id', postId)
                .eq('user_token', userToken);
        } catch (e: any) {
            console.log(e);
            throw new Error('좋아요 데이터를 삭제하는데 실패했습니다.');
        }

    }

    async MyLikeData(myUserToken: string): Promise<LikeResponseEntity[]> {
        try {
            const {data, error} = await supabase.from('liked')
                .select('*')
                .eq('user_token', myUserToken);

            let lstLikeResponseEntity: LikeResponseEntity[] = [];
            data?.forEach((e) => {
                let likeData: LikeResponseEntity = {
                    id: e.id,
                    created_at: e.created_at,
                    user_token: e.user_token,
                    post_id: e.post_id,
                }
                lstLikeResponseEntity.push(likeData);
            });

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('나의 좋아요 데이터를 가져오는데 실패했습니다.');
            }

            return lstLikeResponseEntity;
        } catch (e: any) {
            console.log(e);
            throw new Error('나의 좋아요 데이터를 가져오는데 실패했습니다.');
        }
    }


    async getAllPendingCode(type: string): Promise<CodeModel[]> {
        try {
            const {data, error} = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('state', type)
                .order('created_at', {ascending: false});

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.images,
                    price: e.code.code_price,
                    userToken: e.user_token,
                    category: e.category,
                    language: e.code.language,
                    postType: e.post_type,
                    createdAt: e.created_at,
                    aiSummary: e.code.ai_summary,
                    sellerGithubName: e.code.seller_github_name,
                    buyerCount: e.code.buyer_count,
                    popularity: e.code.popularity,
                    hashTag: e.hash_tag,
                    state: e.state,
                    githubRepoUrl: e.code.github_repo_url,
                    adminGitRepoURL: e.code.admin_git_repo_url,
                    reviewResultMsg: e.code.review_result_msg,
                    viewCount: e.view_count,
                    isDeleted: e.is_deleted,
                }
                lstCodeModel.push(codeModel);
            });
            //console.log(data);
            return lstCodeModel;
        } catch (e: any) {
            console.log(e);
            throw new Error('승인 대기중인 게시글 목록을 가져오는 데 실패했습니다.');
        }

    }

    async getAllMyLikeData(myUserToken: string): Promise<LikeResponseEntity[]> {
        try {
            const {data, error} = await supabase.from('liked')
                .select('*')
                .eq('user_token', myUserToken);

            let lstLikeResponseEntity: LikeResponseEntity[] = [];
            data?.forEach((e) => {
                let likeData: LikeResponseEntity = {
                    id: e.id,
                    created_at: e.created_at,
                    user_token: e.user_token,
                    post_id: e.post_id,
                }
                lstLikeResponseEntity.push(likeData);
            });

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('나의 좋아요 데이터를 가져오는데 실패했습니다.');
            }

            return lstLikeResponseEntity;
        } catch (e: any) {
            console.log(e);
            throw new Error('나의 좋아요 데이터를 가져오는데 실패했습니다.');
        }
    }


    async getAllMyCode(userToken: string): Promise<CodeModel[]> {
        try {
            const {data, error} = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('user_token',userToken)
                .order('created_at', {ascending: false});

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.img_urls,
                    price: e.code.code_price,
                    userToken: e.user_token,
                    category: e.category,
                    language: e.code.language,
                    postType: e.post_type,
                    createdAt: e.created_at,
                    aiSummary: e.code.ai_summary,
                    sellerGithubName: e.code.seller_github_name,
                    buyerCount: e.code.buyer_count,
                    popularity: e.code.popularity,
                    hashTag: e.hash_tag,
                    state: e.state,
                    githubRepoUrl: e.code.github_repo_url,
                    adminGitRepoURL: e.code.admin_git_repo_url,
                    reviewResultMsg: e.reject_message,
                    viewCount: e.view_count,
                    isDeleted: e.is_deleted,
                }
                lstCodeModel.push(codeModel);
            });
            //console.log(data);
            return lstCodeModel;
        } catch (e: any) {
            console.log(e);
            throw new Error('프로필- 게시글 목록을 가져오는 데 실패했습니다.');
        }

    }



    async forkForSellerGitRepo(octokit: Octokit, owner: string, repo: string): Promise<string> {
        try {
            const urlConvertArr = repo.split('/');
            const repoName = urlConvertArr[urlConvertArr.length - 1];
            console.log(repoName);
            const adminOwner: string = "team-code-room";
            // 1. admin의 모든 레포지토리 가져오기
            const repos = await this.fetchAllRepositories(String(process.env.REACT_APP_GITHUB_TOKEN));

            var existingFork = false;
            repos.forEach((repository:any) => {
                if (repository.name === repoName) {
                    existingFork = true;
                }
            });

            // 2. 기존에 포크를 했던 이력이 존재하는지 체크 (재심사 요청 케이스)
            if (existingFork) {
                console.log(`이미 ${owner}/${repoName}를 fork했습니다.`);
                const response = await axios.post<any>(`${serverURL}/sync-fork`, {
                    owner: owner,
                    repo: repoName,
                    forkOwner: 'team-code-room'});

                console.log('Sync successful:', response.data['message']);
                if (response.data['message'] != 'Sync successful') {
                    toast.error('깃허브를 싱크하는 과정에서 문제가 발생했습니다');
                    return 'error';
                }

                const github_base_url = 'https://github.com/';
                return `${github_base_url}/${adminOwner}/${repoName}`;
            }

            const result = await useOctokit.request('POST /repos/{owner}/{repo}/forks', {
                owner: owner,
                repo: repoName,
                name: repoName,
                default_branch_only: true,
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28',
                },
            });
            console.log(result.data);
            return result.data.html_url;
        } catch (e) {
            console.dir(e);
            throw new Error('github repo 포크 오류');
        }
    }

    async fetchAllRepositories(token: string): Promise<any[]> {
        const octokit = new Octokit({ auth: token });
        let page = 1;
        let allRepositories: any[] = [];

        while (true) {
            try {
                const response = await octokit.rest.repos.listForAuthenticatedUser({
                    per_page: 100,
                    page: page,
                });

                if (response.data.length === 0) {
                    break;
                }

                allRepositories = allRepositories.concat(response.data);
                page++;
            } catch (error) {
                if (error instanceof Error) {
                    console.error('Error fetching repositories:', error.message);
                } else {
                    console.error('An unknown error occurred');
                }
                break;
            }
        }

        return allRepositories;
    }

    async updateCodeRequestState(userToken: string, postId: string, state: string) {
        try {
            const {error} = await supabase.from('post')
                .update({state: state})
                .eq('id', postId)
                .eq('user_token', userToken);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글 상태 변경에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 상태 변경에 실패했습니다.');
        }
    }

    async updateCodeRequestRejectMessage(userToken: string, postId: string, reviewResultMsg: string) {
        try {
            const {error} = await supabase.from('post')
                .update({review_result_msg: reviewResultMsg})
                .eq('id', postId)
                .eq('user_token', userToken);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('반려사유 저장에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('반려사유 저장에 실패했습니다.');
        }
    }

    async updateAdminGithubRepoUrl(postId: string, adminGithubRepoUrl: string):Promise<string> {
        try {
            const {data, error} = await supabase.from('code')
                .update({admin_git_repo_url: adminGithubRepoUrl})
                .eq('post_id', postId);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('포크된 레포지토리 링크 저장에 실패했습니다.');
            }

            return data!;

        } catch (e: any) {
            console.log(e);
            throw new Error('포크된 레포지토리 링크 저장에 실패했습니다.');
        }
    }


    async getMyCodeByStatus(userToken: string, type: string): Promise<CodeModel[]> {
        try {
            const {data, error} = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('state', type)
                .eq('user_token', userToken)
                .order('created_at', {ascending: false});

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.images,
                    price: e.code.code_price,
                    userToken: e.user_token,
                    category: e.category,
                    language: e.code.language,
                    postType: e.post_type,
                    createdAt: e.created_at,
                    aiSummary: e.code.ai_summary,
                    sellerGithubName: e.code.seller_github_name,
                    buyerCount: e.code.buyer_count,
                    popularity: e.code.popularity,
                    hashTag: e.hash_tag,
                    state: e.state,
                    githubRepoUrl: e.code.github_repo_url,
                    adminGitRepoURL: e.code.admin_git_repo_url,
                    reviewResultMsg: e.reject_message,
                    viewCount: e.view_count,
                    isDeleted: e.is_deleted,
                }
                lstCodeModel.push(codeModel);
            });
            //console.log(data);
            return lstCodeModel;
        } catch (e: any) {
            console.log(e);
            throw new Error('내 게시글을 타입에 따라 가져오는 데 실패했습니다.');
        }

    }

    async getMyPurchaseSaleHistory(myUserToken: string): Promise<PurchaseSaleRes[] | null> {
        try {
            const {data, error} = await supabase.from('purchase_sale_history')
                .select('*')
                .eq('purchase_user_token', myUserToken);

            let lstPurchaseSale: PurchaseSaleRes[] = [];
            data?.forEach((e) => {
                let purchaseSale: PurchaseSaleRes = {
                    id: e.id,
                    post_id: e.post_id,
                    sell_price: e.sell_price,
                    use_cash: e.use_cash,
                    is_confirmed: e.is_confirmed,
                    purchase_user_token: e.purchase_user_token,
                    sales_user_token: e.sales_user_token,
                    bootpay_payment_id: e.bootpay_payment_id,
                    pay_type: e.pay_type,
                    created_at: e.created_at,
                }
                lstPurchaseSale.push(purchaseSale);
            });
            //console.log("구매내역" +  JSON.stringify(data) );

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('구매기록을 가져오는 데 실패했습니다.');
            }

            return lstPurchaseSale;
        } catch (e: any) {
            console.log(e);
            throw new Error('구매기록을 가져오는 데 실패했습니다.');
        }
    }

    async replyMessageToUser(content: string, targetUserToken: string) {
        try {
            const user: User = await this.getCurrentLoginUser();
            console.log(`${content}`);
            console.log(`${targetUserToken}`);
            console.log(`${user.id}`);
            const myToken: string = user.id;
            const userModel = await this.getTargetUser(myToken);
            const notificationObj = {
                "title": `${userModel.name}님이 보낸 메시지`,
                "content": content,
                "to_user_token": targetUserToken,
                "from_user_token": user?.id,
                "notification_type": NotificationType.message_from_user,
            }
            const {data, error} = await supabase.from('notification').insert(notificationObj).select();

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('답장 전송을 하는 도중 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('답장 전송을 하는 도중 실패했습니다.');
        }
    }

    async getUserTotalAmount(myUserToken: string): Promise<UsersAmountModel> {
        try {
            const {data, error} = await supabase.from('users_amount')
                .select('*')
                .eq('user_token', myUserToken);

            let lstUserAmountEntity: UsersAmountModel[] = [];

            if(data?.length === 0 || !data){
                throw new Error('유저의 합산 캐시를 가져오는 데 실패했습니다.');
            }
                let userAmountEntity: UsersAmountModel = {
                    id: data[0].id,
                    user_token: data[0].user_token,
                    coin_amount: data[0].coin_amount
                }
                lstUserAmountEntity.push(userAmountEntity);


            return lstUserAmountEntity[0];

        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 총 재화를 가져오는 데 실패했습니다.');
        }
    }
    async getUserTotalPoint(myUserToken: string): Promise<number> {
        try {
            const {data, error} = await supabase.from('users_amount')
                .select('*')
                .eq('user_token', myUserToken);

            if (!data || data.length === 0) {
                return 0;  // 데이터가 없는 경우 합산 코인 0으로 반환
            }

            let userAmountEntity: UsersAmountModel = {
                            id: data[0].id,
                            user_token: data[0].user_token,
                            coin_amount: data[0].coin_amount
                        }
             return userAmountEntity.coin_amount;

        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 합산 커밋 코인을 가져오는 데 실패했습니다.');
        }
    }

    async insertUserCoinHistory(pointHistoryRequestEntity: UsersCoinHistoryReq) {
        const coinHistoryObj = { // TODO: coinHistoryObj로 변환이 필요한지 확인
            "coin": pointHistoryRequestEntity.coin,
            "amount": pointHistoryRequestEntity.amount,
            "user_token": pointHistoryRequestEntity.user_token,
            "description": pointHistoryRequestEntity.description,
            "from_user_token": pointHistoryRequestEntity.from_user_token,
            "coin_history_type": pointHistoryRequestEntity.coin_history_type,
        }

        try {
           // console.log("insert userPoint history");
            const {data, error} = await supabase.from("users_coin_history").insert(coinHistoryObj).select();

            if (error) {
                console.log(JSON.stringify(error));

                throw new Error('유저의 코인 히스토리를 insert 하는데 실패했습니다.');
            }


        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 코인 히스토리를 insert 하는데 실패했습니다.');
        }

    }

    async deleteAllProfileImageInFolder(userToken: string){
        const path:string = `profile/${userToken}/`;
        const { data,error } = await supabase.storage.from('coderoom').list(path); // 내 토큰 밑의 모든 이미지들을 가져옴

        if(error){
            console.log("error" + error.message);
            throw new Error('프로필 이미지 변경 - 기존 이미지 삭제에 실패했습니다.');
        }
        const lstDeleteImages : string[] = [];


        data?.forEach((e) => {
            lstDeleteImages.push(`profile/${userToken}/${e.name}`);
        });

        await supabase.storage.from('coderoom').remove(lstDeleteImages);
    }

    async uploadProfileImage(userToken: string, file: File): Promise<string> {
        try {

           // upload 시 기존 사진 삭제

            await this.deleteAllProfileImageInFolder(userToken);

            const date = createTodayDate();
            const path: string = `profile/${userToken}/${date}`;

            const {data, error} = await supabase
                .storage
                .from('coderoom')
                .upload(path, file, {upsert: true, cacheControl: '0'});
            const publicUrl = await this.getImgPublicUrl(path);
            // lstPublicUrl.push(publicUrl);

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.name);
                console.log("error" + error.stack);

                throw new Error('이미지 저장에 실패했습니다.');
            }

            return publicUrl;

        } catch (e: any) {
            console.log(e);
            throw new Error('이미지 저장에 실패했습니다.');
        }
    }

    async updateProfileImgUrl(userToken: string, profileUrl: string) {
        try {
            const {error} = await supabase.from('users')
                .update({profile_url: profileUrl}).eq('user_token', userToken);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('프로필 이미지 링크 저장에 실패하였습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('프로필 이미지 링크 저장에 실패하였습니다.');
        }
    }


    async updateAboutMeData(userToken: string, introduceText: string) {
        try {
            const {error} = await supabase.from('users')
                .update({about_me: introduceText}).eq('user_token', userToken);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('자기소개 저장에 실패하였습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('자기소개 저장에 실패하였습니다.');
        }
    }


    async insertBootpayPayment(bootpayPayment: BootPayPaymentModel):Promise<number> {

        try {
            const {error, data} = await supabase.from('bootpay_payment').insert(bootpayPayment).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('결제내역 insert에 실패했습니다.');
            }

            console.log("id: "+data[0].id);
            return data[0].id;
        } catch (e: any) {
            console.log(e);
            throw new Error('결제내역 insert에 실패했습니다.');
        }
    }

    async updatePostData(codeEditRequestEntity: CodeEditRequestEntity) {
        // post table 수정
        try {
            const {error} = await supabase.from('post')
                .update({
                    img_urls: codeEditRequestEntity.img_urls,
                    title: codeEditRequestEntity.title,
                    description: codeEditRequestEntity.description,
                    category: codeEditRequestEntity.category,
                    state: codeEditRequestEntity.state,
                })
                .eq('id', codeEditRequestEntity.post_id);
            await this.updateCodeData(codeEditRequestEntity);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글 수정 - post데이터 업데이트 실패');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 수정 - post데이터 업데이트 실패');
        }
    }

    async updateCodeData(codeEditRequestEntity: CodeEditRequestEntity) {
        // 코드 테이블 수정
        try {
            const {error} = await supabase.from('code')
                .update({
                    code_price: codeEditRequestEntity.price,
                    ai_summary: codeEditRequestEntity.ai_summary,
                })
                .eq('post_id', codeEditRequestEntity.post_id);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글 수정 - code 데이터 업데이트 실패');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 수정 - code 데이터 업데이트 실패');
        }
    }

    async getMySaleHistory(myUserToken: string): Promise<PurchaseSaleRes[] | null> {
        try {
            const {data, error} = await supabase.from('purchase_sale_history')
                .select('*')
                .eq('sales_user_token', myUserToken,)
                .order('created_at', {ascending: false});

            let lstPurchaseSaleData: PurchaseSaleRes[] = [];

            // id를 가져와야됨
            data?.forEach((e) => {
                lstPurchaseSaleData.push(e);
            });
            // console.log("판매 기록" +  JSON.stringify(data) );


            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('판매 기록을 가져오는 데 실패했습니다.');
            }

            return lstPurchaseSaleData;
        } catch (e: any) {
            console.log(e);
            throw new Error('판매 기록을 가져오는 데 실패했습니다.');
        }
    }

    async getMySaleConfirmedHistory(myUserToken: string, isConfirmed: boolean): Promise<PurchaseSaleRes[] | null> {
        try {
            const {data, error} = await supabase.from('purchase_sale_history')
                .select('*')
                .eq('sales_user_token', myUserToken,)
                .eq('is_confirmed', isConfirmed)
                //.eq('pay_type', 'cash')
                .contains('pay_type',['cash'])
                .order('created_at', {ascending: false});

            let lstPurchaseSaleData: PurchaseSaleRes[] = [];

            // id를 가져와야됨
            data?.forEach((e) => {
                lstPurchaseSaleData.push(e);
            });

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('정산된 판매 기록을 가져오는 데 실패했습니다.');
            }

            return lstPurchaseSaleData;
        } catch (e: any) {
            console.log(e);
            throw new Error('정산된 판매 기록을 가져오는 데 실패했습니다.');
        }
    }

    async getUserCoinHistory(myUserToken: string): Promise<UsersCoinHistoryRes[]> {
        try {
            const {data, error} = await supabase.from('users_coin_history')
                .select('*')
                .eq('user_token', myUserToken)
                .order('created_at', {ascending: false});

            let lstCoinHistory: UsersCoinHistoryRes[] = [];
            data?.forEach((e) => {
                let coinHistory: UsersCoinHistoryRes = {
                    id: e.id,
                    user_token: e.user_token,
                    coin: e.coin,
                    amount: e.amount,
                    description: e.description,
                    coin_history_type: e.coin_history_type,
                    created_at: e.created_at,
                }
                lstCoinHistory.push(coinHistory);
            });
            return lstCoinHistory;

        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 코인 히스토리를 가져오는 데 실패했습니다.');
        }
    }

    async getAllUserCoinHistory(): Promise<UsersCoinHistoryRes[]> {
        try {
            const {data, error} = await supabase.from('users_coin_history')
                .select('*')
                .order('created_at', {ascending: false});

            let lstCoinHistory: UsersCoinHistoryRes[] = [];
            data?.forEach((e) => {
                let coinHistory: UsersCoinHistoryRes = {
                    id: e.id,
                    user_token: e.user_token,
                    coin: e.coin,
                    amount: e.amount,
                    description: e.description,
                    coin_history_type: e.coin_history_type,
                    created_at: e.created_at,
                }
                lstCoinHistory.push(coinHistory);
            });
            return lstCoinHistory;

        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 코인 히스토리를 가져오는 데 실패했습니다.');
        }
    }

    // async getUserCashPointHistory(myUserToken: string):Promise<CashPointHistoryEntity[]> {
    //     try {
    //       const lstCashHistory:CashHistoryResponseEntity[] = await this.getUserCashHistory(myUserToken);
    //       const lstPointHistory: PointHistoryResponseEntity[] = await this.getUserPointHistory(myUserToken);
    //
    //         const cashHistory: CashPointHistoryEntity[] = lstCashHistory.map(cash => ({
    //             id: cash.id,
    //             user_token: cash.user_token,
    //             price: cash.cash,
    //             amount: cash.amount,
    //             price_history_type: cash.cash_history_type,
    //             pay_type: PayType.cash,
    //             description: cash.description,
    //             created_at: cash.created_at,
    //         }));
    //
    //         const pointHistory: CashPointHistoryEntity[] = lstPointHistory.map(point => ({
    //             id: point.id,
    //             user_token: point.user_token,
    //             price: point.point,
    //             amount: point.amount,
    //             price_history_type: point.point_history_type,
    //             pay_type: PayType.point,
    //             description: point.description,
    //             created_at: point.created_at,
    //         }));
    //
    //
    //         // 두 배열을 병합
    //         const lstPointCashHistory:CashPointHistoryEntity[] = [...cashHistory, ...pointHistory];
    //
    //         // created_at 기준으로 정렬
    //         lstPointCashHistory.sort((a, b) => {
    //             const dateA : number = new Date(a.created_at || '').getTime();
    //             const dateB = new Date(b.created_at || '').getTime();
    //             return dateB - dateA;
    //         });
    //
    //         return lstPointCashHistory;
    //
    //     } catch (e: any) {
    //         console.log(e);
    //         throw new Error('유저의 코인 히스토리를 가져오는 데 실패했습니다.');
    //     }
    // }



    async setReviewData(review: PurchaseReviewEntity) {
        const user = await this.getCurrentLoginUser();
        review.reviewer_user_token = user?.id;
        const {data, error} = await supabase.from('purchase_review').insert([review]).select();

        if (error) {
            console.log("error" + error.message);
            console.log("error" + error.code);
            console.log("error" + error.details);
            console.log("error" + error.hint);

            throw new Error('리뷰 작성에 실패했습니다.');
        }
    }

    async getReviewData(postId: number): Promise<PurchaseReviewEntity> {
        const user = await this.getCurrentLoginUser();

        const { data, error } = await supabase
            .from('purchase_review')
            .select('*')
            .eq('post_id', postId)
            .eq('reviewer_user_token', user?.id)
            .single();

        if (error) {
            console.error("Error:", error.message);
            console.error("Code:", error.code);
            console.error("Details:", error.details);
            console.error("Hint:", error.hint);

            throw new Error('리뷰 데이터를 불러오는 데 실패했습니다.');
        }
        return data;
    }

// 특정 post_id와 reviewer_user_token에 대한 리뷰 조회 함수 추가
    async getReviewByPostAndUser(post_id: number): Promise<PurchaseReviewEntity|null> {
        const user = await this.getCurrentLoginUser();
        const myToken: string = user.id;

        const {data, error} = await supabase
            .from('purchase_review')
            .select()
            .eq('post_id', post_id)
            .eq('reviewer_user_token', myToken)
            .maybeSingle()

        if(!data){
            return null;
        }

        if (error) {
            console.log("error" + error.message);
            console.log("error" + error.code);
            console.log("error" + error.details);
            console.log("error" + error.hint);

            throw new Error('작성된 리뷰 데이터를 가져오는데에 실패했습니다.');
        }

        return data;
    };

    async getAdminPurchaseSaleHistory(isConfirmed: boolean): Promise<PurchaseSaleRes[] | null> {
        try {
            const {data, error} = await supabase.from('purchase_sale_history')
                .select('*')
                .eq('is_confirmed', isConfirmed)
                .contains('pay_type', ['coin'])
                .order('created_at', {ascending: false});

            let lstPurchaseSaleData: PurchaseSaleRes[] = [];

            // id를 가져와야됨
            data?.forEach((e) => {
                lstPurchaseSaleData.push(e);
            });

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('판매 기록을 가져오는 데 실패했습니다.');
            }

            return lstPurchaseSaleData;
        } catch (e: any) {
            console.log(e);
            throw new Error('판매 기록을 가져오는 데 실패했습니다.');
        }
    }

    async updatePurchaseSaleIsConfirmed(purchase_user_token: string, sales_user_token: string, postId: number,date:string) {
        try {
            const {error} = await supabase.from('purchase_sale_history')
                .update({is_confirmed: true,confirmed_time:date})
                .eq('post_id', postId)
                .eq('purchase_user_token', purchase_user_token)
                .eq('sales_user_token', sales_user_token);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('관리자- 정산에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('관리자 - 정산에 실패했습니다.');
        }
    }

    async insertNotification(notificationObj: NotificationEntity) {
        try {
            const {data, error} = await supabase.from('notification').insert(notificationObj).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('알림 전송에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('알림 전송에 실패했습니다.');
        }
    }

    async getQueryCode(searchTargetWord: string):Promise<MainPageCodeListEntity[]> {
        try {
            const {data, error} = await supabase.from('post')
                .select('*, code!inner(*)')
                .or(`title.like.%${searchTargetWord}%,description.like.%${searchTargetWord}%`)
                .eq('state', PostStateType.approve)
                .order('created_at', {ascending: false});

            let lstMainPageCode: MainPageCodeListEntity[] = [];
            if (data) {
                for (const e of data) {
                    const likedCount: number = await this.getTargetPostLikedNumber(e.id);
                    const reviewCount: number = await this.getPurchaseReviewsCount(e.id);


                    let mainPageCodeEntity: MainPageCodeListEntity = {
                        id: e.id,
                        title: e.title,
                        description: e.description,
                        images: e.images,
                        code_price: e.code.code_price,
                        userToken: e.user_token,
                        category: e.category,
                        language: e.code.language,
                        postType: e.post_type,
                        createdAt: e.created_at,
                        aiSummary: e.code.ai_summary,
                        githubRepoUrl: e.code.github_repo_url,
                        buyerCount: e.code.buyer_count,
                        popularity: e.code.popularity,
                        hashTag: e.hash_tag,
                        sellerGithubName: e.code.seller_github_name,
                        state: e.state,
                        adminGitRepoURL: e.code.admin_git_repo_url,
                        rejectMessage: e.reject_message,
                        viewCount: e.view_count,
                        likeCount: likedCount,
                        reviewCount: reviewCount,
                        is_deleted: e.is_deleted,
                    }
                    lstMainPageCode.push(mainPageCodeEntity);
                }
            }
            return lstMainPageCode;
        } catch (e: any) {
            console.log(e);
            throw new Error('검색 게시글 목록을 가져오는 데 실패했습니다.');
        }
    }

    async getAllUserManage(): Promise<AdminUserManageEntity[]> {
        try {
            const {data, error} = await supabase.from('users')
                .select('*');


            let lstUserModel: AdminUserManageEntity[] = [];
            if (!data) {
                return [];
            }

            for (const adminUserManage of data) {
                const point = await this.getUserTotalPoint(adminUserManage.user_token!);
                const cash = await this.getUserTotalCash(adminUserManage.user_token!);

                let userManageEntity: AdminUserManageEntity = {
                    id: adminUserManage.id,
                    auth_type: adminUserManage.auth_type,
                    email: adminUserManage.email,
                    name: adminUserManage.name,
                    nickname: adminUserManage.nickname,
                    profile_url: adminUserManage.profile_url,
                    about_me: adminUserManage.about_me,
                    contacts: adminUserManage.contacts,
                    user_token: adminUserManage.user_token,
                    point: point,
                    cash: cash,
                    created_at: adminUserManage.created_at,

                }
                lstUserModel.push(userManageEntity);
            }
            //console.log(data);


            return lstUserModel;
        } catch (e: any) {
            console.log(e);
            throw new Error('관리자 : 모든 유저 데이터를 가져오는 데 실패했습니다.');
        }

    }

    async getAllBootpayPayment(): Promise<BootPayPaymentModel[]> {
        try {
            const {data, error} = await supabase.from('bootpay_payment')
                .select('*');


            let lstBootpayPaymentModel: BootPayPaymentModel[] = [];

            data?.map((e) => {
                lstBootpayPaymentModel.push(e);
            })

            return lstBootpayPaymentModel;
        } catch (e: any) {
            console.log(e);
            throw new Error('관리자 : 모든 유저 데이터를 가져오는 데 실패했습니다.');
        }

    }

    async getTargetUserManageData(userToken: string): Promise<AdminUserManageEntity> {
        try {
            const {data, error} = await supabase.from('users')
                .select('*')
                .eq('user_token', userToken);


            let lstUserModel: AdminUserManageEntity[] = [];


            for (const adminUserManage of data!) {
                const point = await this.getUserTotalPoint(adminUserManage.user_token!);
                const cash = await this.getUserTotalCash(adminUserManage.user_token!);

                let userManageEntity: AdminUserManageEntity = {
                    id: adminUserManage.id,
                    auth_type: adminUserManage.auth_type,
                    email: adminUserManage.email,
                    name: adminUserManage.name,
                    nickname: adminUserManage.nickname,
                    profile_url: adminUserManage.profile_url,
                    about_me: adminUserManage.about_me,
                    contacts: adminUserManage.contacts,
                    user_token: adminUserManage.user_token,
                    point: point,
                    cash: cash,
                    created_at: adminUserManage.created_at,

                }
                lstUserModel.push(userManageEntity);
            }
            //console.log(data);


            return lstUserModel[0];
        } catch (e: any) {
            console.log(e);
            throw new Error('관리자 : 특정 유저 데이터를 가져오는 데 실패했습니다.');
        }

    }

    //
    //
    // async checkAndForkRepository(
    //     octokit: Octokit,
    //     owner: string,
    //     repo: string
    // ) {
    //     try {
    //
    //
    //         // 4. fork되지 않았다면 fork 실행
    //         const { data: newFork } = await octokit.repos.createFork({
    //             owner,
    //             repo,
    //         });
    //
    //         console.log(`${owner}/${repo}를 성공적으로 fork했습니다. 새 repo: ${newFork.full_name}`);
    //     } catch (error) {
    //         console.error("Fork 과정에서 오류가 발생했습니다:", error);
    //     }
    // }


    async getPurchaseReviews(postId: number): Promise<PurchaseReviewEntity[] | null> {
        try {
            const {data, error} = await supabase.from('purchase_review')
                .select()
                .eq('post_id', postId)
                .order('created_at', {ascending: false});

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('리뷰 리스트 조회에 실패했습니다');
            }
            let lstReview: PurchaseReviewEntity[] = [];
            data?.forEach((e) => {
                let reviewModel: PurchaseReviewEntity = {
                    id: e.id,
                    post_id: e.post_id,
                    review_title: e.review_title,
                    review_content: e.review_content,
                    rating: e.rating,
                    reviewer_user_token: e.reviewer_user_token,
                    created_at: e.created_at
                }
                lstReview.push(reviewModel);
            });
            // console.log(data);
            return lstReview;
        } catch (e: any) {
            console.log(e);
            throw new Error('리뷰 리스트 조회에 실패했습니다');
        }
    }

    async getPurchaseReviewsCount(postId: number): Promise<number> {
        try {
            const {data, count, error} = await supabase.from('purchase_review')
                .select('*', {count: 'exact'})
                .eq('post_id', postId);

            let resultNumber;
            if (!count) {
                resultNumber = 0
            } else {
                resultNumber = count;
            }

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('리뷰 리스트 갯수 조회에 실패했습니다');
            }
            return resultNumber;

        } catch (e: any) {
            console.log(e);
            throw new Error('리뷰 리스트 갯수 조회에 실패했습니다');
        }
    }

    async getTargetPostLikedNumber(postId: number): Promise<number> {
        try {
            const {data, count, error} = await supabase.from('liked')
                .select('*', {count: 'exact'})
                .eq('post_id', postId);

            let resultNumber;
            if (!count) {
                resultNumber = 0
            } else {
                resultNumber = count;
            }

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글 좋아요 수 조회에 실패했습니다.');
            }


            return resultNumber;
        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 좋아요 수 조회에 실패했습니다.');
        }
    }

    async deletePost(postId: number) {
        try {
            const {error} = await supabase.from('post')
                .update({is_deleted: true}).eq('id', postId);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('게시글 삭제처리(숨김)에 실패하였습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('게시글 삭제처리(숨김)에 실패하였습니다.');
        }
    }

    async setTrueUserProfileImageRewardStatus(userToken: string) {
        try {
            const {error} = await supabase.from('users')
                .update({is_profile_image_rewarded: true}).eq('user_token', userToken);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('프로필 이미지 설정 보상 상태 저장에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('프로필 이미지 설정 보상 상태 저장에 실패했습니다.');
        }
    }

    async setTrueUserIntroduceRewardStatus(userToken: string) {
        try {
            const {error} = await supabase.from('users')
                .update({is_introduce_rewarded: true}).eq('user_token', userToken);

            if (error) {
                console.log("error" + JSON.stringify(error));
                throw new Error('자기소개 설정 보상 상태 저장에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('자기소개 설정 보상 상태 저장에 실패했습니다.');
        }
    }




    async messageFromAdminToUser(content: string, targetUserToken: string) {
        try {

            const notificationObj = {
                "title": `관리자 메시지`,
                "content": content,
                "to_user_token": targetUserToken,
                "from_user_token": 'admin',
                "notification_type": NotificationType.message_from_admin,
            }
            const {data, error} = await supabase.from('notification').insert(notificationObj).select();

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('관리자 - 쪽지를 보내는 도중 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('답장 전송을 하는 도중 실패했습니다.');
        }
    }

    async getUsersByTokens(tokens: string[]): Promise<UserModel[]> {
        // Supabase의 `in` 쿼리 사용하여 사용자 정보 조회
        const {data , error} = await supabase
            .from('users')
            .select('*')
            .in('user_token', tokens);

        if (error) {
            throw error;
        }

        return data;
    }

    async insertUserAmountHistory(userAmount:UsersAmountModel) {
        try {
            const {error} = await supabase.from('users_amount').insert(userAmount);
            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('user amount insert 에 실패했습니다.');
            }
        } catch (e: any) {
            console.log(e);
            throw new Error('user amount insert 에 실패했습니다.');
        }
    }

    async updateTotalPoint(userToken: string, point: number) {
        try {

            const {error} = await supabase.from('users_amount')
                .update({point_amount: point}).eq('user_token', userToken);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('total point 업데이트에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('total point 업데이트에 실패했습니다.');
        }
    }

    async updateTotalCash(userToken: string, cash: number) {
        try {

            const {error} = await supabase.from('users_amount')
                .update({cash_amount: cash}).eq('user_token', userToken);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('total cash 업데이트에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('total cash 업데이트에 실패했습니다.');
        }
    }

    async getMyNotReadNotification(userToken: string): Promise<NotificationEntity[]> {
        try {
            const {data, error} = await supabase.from('notification')
                .select('*')
                .eq('to_user_token', userToken)
                .eq('is_read',false)
                .order('created_at', {ascending: false});

            let lstNotificationEntity: NotificationEntity[] = [];
            data?.forEach((e) => {
               let notiEntity : NotificationEntity = {
                   id: e.id,
                   title: e.title,
                   content: e.content,
                   to_user_token: e.to_user_token,
                   from_user_token: e.from_user_token,
                   notification_type: e.notification_type,
                   created_at: e.created_at,
               }
                lstNotificationEntity.push(notiEntity);
            });

            return lstNotificationEntity;
        } catch (e: any) {
            console.log(e);
            throw new Error('읽지않은 알림을 가져오는데 실패했습니다.');
        }

    }

    async updateNotificationIsRead(userToken: string){
        try{
            const lstNotReadNoti: NotificationEntity[] =  await this.getMyNotReadNotification(userToken);
            const lstNotReadNotiId:number[] = lstNotReadNoti.map((e: any) => {return e.id});

            for(const id of lstNotReadNotiId){
                const {data, error} = await supabase.from('notification')
                    .update({is_read: true})
                    .eq('id',id);
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('알림을 읽음 처리하는데 실패했습니다.s');
        }
    }

    async updateAdminMarketingText(postId:string, ai_summary: string) {
        try {
            const {data, error} = await supabase.from('code')
                .update({ai_summary: ai_summary})
                .eq('post_id', postId);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('readme marketing text insert 실패');
            }

            return data!;

        } catch (e: any) {
            console.log(e);
            throw new Error('readme marketing text insert 실패');
        }
    }
}


export const apiClient = new ApiClient();