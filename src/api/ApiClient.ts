import { SupabaseAuthAPI } from "./supabase/SupabaseAuthAPI";
import { AuthError, createClient, User, UserResponse } from '@supabase/supabase-js'
import { supabaseConfig } from "../config/supabaseConfig";
import { CodeModel } from "../data/model/CodeModel";
import { UserEntity } from "../data/entity/UserEntity";
import { API_ERROR } from "../constants/define";
import { UserModel } from "../data/model/UserModel";
import { GithubForkURLEntity } from "../data/entity/GithubForkURLEntity";
import axios from 'axios';
import { serverURL } from '../hooks/fetcher/HttpFetcher.ts';
import { useOctokit } from "../index.tsx";
import { isConditionalExpression } from "typescript";
import { NotificationEntity } from "../data/entity/NotificationEntity.ts";
import { NotificationType } from '../enums/NotificationType';
import { PointHistoryRequestEntity } from "../data/entity/PointHistoryRequestEntity";
import { BootPayPaymentEntity } from "../data/entity/BootpayPaymentEntity.ts";
import { title } from "process";

export const supabase = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseKey);

class ApiClient implements SupabaseAuthAPI {
    constructor(
        private readonly auth = supabase.auth,
    ) { }

    async loginWithEmail(email: string, password: string): Promise<User | Boolean> {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
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
            const { error } = await supabase.auth.signOut();
        } catch (e: any) {
            console.log(e);
            throw new Error('로그아웃에 실패했습니다.');
        }
    }

    async getAllCode(): Promise<CodeModel[]> {
        try {
            const { data, error } = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('state', "approve")
                .order('created_at', { ascending: false });

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.images,
                    price: e.code.cost,
                    userToken: e.user_token,
                    category: e.category,
                    postType: e.post_type,
                    createdAt: e.created_at,
                    buyerGuide: e.code.buyer_guide,
                    githubRepoUrl: e.code.github_repo_url,
                    buyerCount: e.code.buyer_count,
                    popularity: e.code.popularity,
                    hashTag: e.hash_tag,
                    sellerGithubName: e.code.seller_github_name,
                    state: e.state,
                    adminGitRepoURL: e.code.admin_git_repo_url,
                    rejectMessage: e.reject_message,
                    viewCount: e.view_count,
                }
                lstCodeModel.push(codeModel);
            });
            //console.log(data);
            return lstCodeModel;
        }
        catch (e: any) {
            console.log(e);
            throw new Error('게시글 목록을 가져오는 데 실패했습니다.');
        }

    }

    async resetPasswordByEmail(email: string) {
        try {
            const { data, error } = await supabase.auth
                //.resetPasswordForEmail(email, { redirectTo: 'http://localhost:3000/change-password' });
                .resetPasswordForEmail(email, { redirectTo: 'https://main--coderoom-io.netlify.app/reset-password' });
        }
        catch (e: any) {
            console.log(e);
            throw new Error('비밀번호 재설정에 실패했습니다.');
        }
    }

    async signUpByEmail(email: string, password: string): Promise<User> {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });
            console.log(data);
            if (error) {
                throw new Error(API_ERROR.USER_ALREADY_REGISTERED);
            }
            return data.user!;
        }
        catch (e: any) {
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
                "contacts": user.contacts,
                "user_token": user.userToken,
            }

            const { data, error } = await supabase.from('users')
                .insert(userData).select();
            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('회원정보 저장에 실패하였습니다.');
            }


        } catch (e: any) {
            console.log(e);
            throw new Error('회원정보 저장에 실패하였습니다.');
        }
    }

    async updateUserPassword(newPassword: string) {
        try {
            const { data, error } = await supabase.auth
                .updateUser({ password: newPassword });
            console.log(data);
        }
        catch (e: any) {
            console.log(e);
            throw new Error('비밀번호 업데이트에 실패했습니다.');
        }

    }

    async getCurrentLoginUser(): Promise<UserResponse> {
        try {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);

                throw new Error('유저 정보를 가져오는데 실패하였습니다.');
            }
            return data;
        } catch (e: any) {
            console.log(e);
            throw new Error('유저 정보를 가져오는데 실패하였습니다.');
        }
    }


    async insertMentoringHistory(mentoring: MentoringRequestEntity) {
        console.log("mentoring: "+ {...mentoring});
        try {
            const { error } = await supabase.from('mentoring_request_history').insert(mentoring);
            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('멘토링 신청내역 저장에 실패하였습니다.');
            }
        } catch (e: any) {
            console.log(e);
            throw new Error('멘토링 신청내역 저장에 실패하였습니다.');
        }
    }


    async insertCodeReviewHistory(codeReview: CodeReviewRequestEntity) {
        console.log("codeReview: " + { ...codeReview });

        try {
            const { error } = await supabase.from('codereview_request_history').insert(codeReview);
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
            const { error } = await supabase.from('post')
                .update({ img_urls: imageUrls }).eq('id', postId);

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
            const { data, error } = await supabase.from('notification').select().eq('from_user_token', userToken);

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
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notification' }, handleInserts)
            .subscribe()
    }

    async getImgPublicUrl(path: string): Promise<string> {
        try {
            const { data } = supabase
                .storage
                .from('coderoom')
                .getPublicUrl(path);
            console.log("publicurl: " + data.publicUrl);
            return data.publicUrl;
        } catch (e: any) {
            console.log(e);
            throw new Error('이미지 주소 다운에 실패했습니다.');
        }
    }

    async uploadImages(userToken: string, postId: number, files: File[]): Promise<string[]> {
        try {

            const lstPublicUrl: string[] = [];

            for (const file of files) {

                const path: string = `boards/code/${userToken}_${postId}_${file.name}.png`;

                const { data, error } = await supabase
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

    async insertPostData(post: PostRequestEntity): Promise<number> {
        try {
            const { data, error } = await supabase.from('post')
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
            const { data, error } = await supabase.from('code')
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
            const { data, error } = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('id', postId);

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.img_urls,
                    price: e.code.cost,
                    userToken: e.user_token,
                    buyerGuide: e.code.buyer_guide,
                    category: e.category,
                    createdAt: e.created_at,
                    postType: e.post_type,
                    popularity: e.code.popularity,
                    buyerCount: e.code.buyer_count,
                    hashTag: e.hash_tag,
                    state: e.state,
                    sellerGithubName: e.code.seller_github_name,
                    githubRepoUrl: e.code.github_repo_url,
                    rejectMessage: e.reject_message,
                    viewCount: e.view_count,
                    adminGitRepoURL: e.code.admin_git_repo_url,
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
        }
        catch (e: any) {
            console.log(e);
            throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
        }

    }

    async getTargetUser(targetUserToken: string): Promise<UserModel> { // userModel만들기
        try {
            const { data, error } = await supabase.from('users')
                .select('*')
                .eq('user_token', targetUserToken);

            let lstUserModel: UserModel[] = [];
            data?.forEach((e) => {
                let userModel: UserModel = {
                    id: e.id,
                    authType: e.auth_type,
                    email: e.email,
                    name: e.name,
                    nickname: e.nickname,
                    profileUrl: e.profile_url,
                    aboutMe: e.about_me,
                    contacts: e.contacts,
                    userToken: e.user_token,
                    createdAt: e.created_at,
                }
                lstUserModel.push(userModel);
            });
            //console.log(data);

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
            }

            return lstUserModel[0];
        }
        catch (e: any) {
            console.log(e);
            throw new Error('해당 게시글을 가져오는 데 실패했습니다.');
        }

    }

    async getUserTotalCash(myUserToken: string): Promise<number> {
        try {
            const { data, error } = await supabase.from('users_cash_history')
                .select('*')
                .eq('user_token', myUserToken)
                .order('created_at', { ascending: false });

            //const stringdata = JSON.stringify(data);
            //console.log("getUserTotalCash: "+stringdata);

            if (!data || data.length === 0) {
                return 0;  // 데이터가 없는 경우 합산 캐시는 0으로 반환
              }
              
                let cashEntity: CashHistoryResponseEntity = {
                    id: data[0].id,
                    user_token: data[0].user_token,
                    cash: data[0].cash,
                    amount: data[0].amount,
                    description: data[0].description,
                    cash_history_type: data[0].cash_history_type,
                    created_at: data[0].created_at,
                }
                const totalCash: number = cashEntity.amount;
            return totalCash;


        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 합산 캐시를 가져오는 데 실패했습니다.');
        }
    }

    async insertUserCashHistory(cashHistoryRequestEntity: CashHistoryRequestEntity) {
        try {
            const { data, error } = await supabase.from('users_cash_history')
                .insert(cashHistoryRequestEntity).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('유저의 캐시 히스토리를 insert 하는데 실패했습니다.');
            }


        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 캐시 히스토리를 insert 하는데 실패했습니다.');
        }

    }

    async insertPurchaseSaleHistory(purchaseSaleRequestEntity: PurchaseSaleRequestEntity) {
        try {
            const { data, error } = await supabase.from('purchase_sale_history')
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
            const { error } = await supabase.from('code')
                .update({ buyer_count: buyerCount }).eq('post_id', postId);

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

            const { error } = await supabase.from('post')
                .update({ view_count: codeData.viewCount + 1 }).eq('id', postId);
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

    async getMyPurchaseSaleHistoryByPostID(myUserToken: string, postId: number): Promise<PurchaseSaleRequestEntity | null> {
        try {
            const { data, error } = await supabase.from('purchase_sale_history')
                .select('*')
                .eq('purchase_user_token', myUserToken)
                .eq('post_id', postId);

            let lstPurchaseSale: PurchaseSaleResponseEntity[] = [];
            data?.forEach((e) => {
                let purchaseSale: PurchaseSaleResponseEntity = {
                    id: e.id,
                    post_id: e.post_id,
                    price: e.price,
                    is_confirmed: e.is_confirmed,
                    purchase_user_token: e.purchase_user_token,
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

            return lstPurchaseSale.length != 0 ? lstPurchaseSale[0] : null;
        }
        catch (e: any) {
            console.log(e);
            throw new Error('구매기록을 가져오는 데 실패했습니다.');
        }
    }

    async getCodeDownloadURL(userName: string, repoName: string, branchName: string): Promise<GithubForkURLEntity> {

        try {
            console.log("getCodeDownloadURL : " + userName + repoName + branchName);
            const result = await axios.get<GithubForkURLEntity>(`${serverURL}/download/${userName}/${repoName}/${branchName}`);
            console.log(`status honghcul : ${result.status}`);
            return result.data;
        } catch (e: any) {
            console.log(e);
            throw new Error('code download error');
        }



    }

    async insertLikedData(likedData: LikeRequestEntity) { // 좋아요 insert
        try {
            const { error } = await supabase.from('liked')
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
            const { data, error } = await supabase.from('liked')
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
        }
        catch (e: any) {
            console.log(e);
            throw new Error('좋아요 데이터를 가져오는데 실패했습니다.');
        }
    }

    async deleteLikeData(userToken: string, postId: number) {
        try {
            const { error } = await supabase
                .from('liked')
                .delete()
                .eq('post_id', postId)
                .eq('user_token', userToken);
        } catch (e: any) {
            console.log(e);
            throw new Error('좋아요 데이터를 삭제하는데 실패했습니다.');
        }

    }


    async getAllPendingCode(type: string): Promise<CodeModel[]> {
        try {
            const { data, error } = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('state', type)
                .order('created_at', { ascending: false });

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.images,
                    price: e.code.cost,
                    userToken: e.user_token,
                    category: e.category,
                    postType: e.post_type,
                    createdAt: e.created_at,
                    buyerGuide: e.code.buyer_guide,
                    sellerGithubName: e.code.seller_github_name,
                    buyerCount: e.code.buyer_count,
                    popularity: e.code.popularity,
                    hashTag: e.hash_tag,
                    state: e.state,
                    githubRepoUrl: e.code.github_repo_url,
                    adminGitRepoURL: e.code.admin_git_repo_url,
                    rejectMessage: e.reject_message,
                    viewCount: e.view_count,
                }
                lstCodeModel.push(codeModel);
            });
            //console.log(data);
            return lstCodeModel;
        }
        catch (e: any) {
            console.log(e);
            throw new Error('승인 대기중인 게시글 목록을 가져오는 데 실패했습니다.');
        }

    }

    async forkForSellerGitRepo(owner: string, repo: string): Promise<string> {
        try {
            const urlConvertArr = repo.split('/');
            const repoName = urlConvertArr[urlConvertArr.length - 1];
            console.log(repoName);

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

    async updateCodeRequestState(userToken: string, postId: string, state: string) {
        try {
            const { error } = await supabase.from('post')
                .update({ state: state })
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

    async updateCodeRequestRejectMessage(userToken: string, postId: string, rejectMessage: string) {
        try {
            const { error } = await supabase.from('post')
                .update({ reject_message: rejectMessage })
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

    async updateAdminGithubRepoUrl(postId: string, adminGithubRepoUrl: string) {
        try {
            const { error } = await supabase.from('code')
                .update({ admin_github_repo_url: adminGithubRepoUrl })
                .eq('post_id', postId);

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('포크된 레포지토리 링크 저장에 실패했습니다.');
            }

        } catch (e: any) {
            console.log(e);
            throw new Error('포크된 레포지토리 링크 저장에 실패했습니다.');
        }
    }


    async getMyCodeByStatus(userToken: string, type: string): Promise<CodeModel[]> {
        try {
            const { data, error } = await supabase.from('post')
                .select('*, code!inner(*)')
                .eq('state', type)
                .eq('user_token', userToken)
                .order('created_at', { ascending: false });

            let lstCodeModel: CodeModel[] = [];
            data?.forEach((e) => {
                let codeModel: CodeModel = {
                    id: e.id,
                    title: e.title,
                    description: e.description,
                    images: e.images,
                    price: e.code.cost,
                    userToken: e.user_token,
                    category: e.category,
                    postType: e.post_type,
                    createdAt: e.created_at,
                    buyerGuide: e.code.buyer_guide,
                    sellerGithubName: e.code.seller_github_name,
                    buyerCount: e.code.buyer_count,
                    popularity: e.code.popularity,
                    hashTag: e.hash_tag,
                    state: e.state,
                    githubRepoUrl: e.code.github_repo_url,
                    adminGitRepoURL: e.code.admin_git_repo_url,
                    rejectMessage: e.reject_message,
                    viewCount: e.view_count,
                }
                lstCodeModel.push(codeModel);
            });
            //console.log(data);
            return lstCodeModel;
        }
        catch (e: any) {
            console.log(e);
            throw new Error('내 게시글을 타입에 따라 가져오는 데 실패했습니다.');
        }

    }

    async getMyPurchaseSaleHistory(myUserToken: string): Promise<PurchaseSaleResponseEntity[] | null> {
        try {
            const { data, error } = await supabase.from('purchase_sale_history')
                .select('*')
                .eq('purchase_user_token', myUserToken);

            let lstPurchaseSale: PurchaseSaleResponseEntity[] = [];
            data?.forEach((e) => {
                let purchaseSale: PurchaseSaleResponseEntity = {
                    id: e.id,
                    post_id: e.post_id,
                    price: e.price,
                    is_confirmed: e.is_confirmed,
                    purchase_user_token: e.purchase_user_token,
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

            return lstPurchaseSale;
        }
        catch (e: any) {
            console.log(e);
            throw new Error('구매기록을 가져오는 데 실패했습니다.');
        }
    }

    async replyMessageToUser(content: string, targetUserToken: string) {
        try {
            const userResponse = await this.getCurrentLoginUser();
            console.log(`${content}`);
            console.log(`${targetUserToken}`);
            console.log(`${userResponse.user.id}`);
            const myToken: string = userResponse.user.id;
            const userModel = await this.getTargetUser(myToken);                 
            const notificationObj = {
                "title": `${userModel.name}님이 보낸 메시지`,
                "content": content,
                "to_user_token": targetUserToken,
                "from_user_token": userResponse.user?.id,
                "notification_type": NotificationType.message_from_user,
            }
            const { data, error } = await supabase.from('notification').insert(notificationObj).select();

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

    async getMyMentorings(myUserToken: string): Promise<MentoringResponseEntity[] | null> {

        try {
            const { data, error } = await supabase.from('mentoring_request_history')
                .select('*')
                .eq('from_user_token', myUserToken);

            let lstMentoring: MentoringResponseEntity[] = [];
            data?.forEach((e) => {
                let mentoring: MentoringResponseEntity = {
                    id: e.id,
                    title: e.title,
                    content: e.content,
                    to_user_token: e.to_user_token,
                    from_user_token: e.from_user_token,
                    request_date: e.request_data,
                    created_at: e.created_at,
                }
                lstMentoring.push(mentoring);
            });
            //console.log("구매내역" + { ...data });

            if (error) {
                console.log("error" + error.message);
                console.log("error" + error.code);
                console.log("error" + error.details);
                console.log("error" + error.hint);

                throw new Error('멘토링 데이터를 가져오는 데 실패했습니다.');
            }

            return lstMentoring;


        } catch (e: any) {
            console.log(e);
            throw new Error('멘토링 데이터를 가져오는 데 실패했습니다.');
        }
    }

    async getUserTotalPoint(myUserToken: string): Promise<number> {
        try {
            const { data, error } = await supabase.from('users_point_history')
                .select('*')
                .eq('user_token', myUserToken)
                .order('created_at', { ascending: false });

            //let lstPointEntity: PointHistoryResponseEntity[] = [];
            if (!data || data.length === 0) {
                return 0;  // 데이터가 없는 경우 합산 포인트 0으로 반환
              }
              let pointEntity: PointHistoryResponseEntity = {
                id: data[0].id,
                user_token: data[0].user_token,
                point: data[0].point,
                amount: data[0].amount,
                description: data[0].description,
                point_history_type: data[0].point_history_type,
                created_at: data[0].created_at,
            }
            
            const totalPoint: number = pointEntity.amount;
            return totalPoint;

        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 합산 커밋 포인트를 가져오는 데 실패했습니다.');
        }
    }

    async insertUserPointHistory(pointHistoryRequestEntity: PointHistoryRequestEntity) {
        console.log(pointHistoryRequestEntity);
        const pointHistoryObj = {
            "point": pointHistoryRequestEntity.point,
            "amount": pointHistoryRequestEntity.amount,
            "user_token": pointHistoryRequestEntity.user_token,
            "description": pointHistoryRequestEntity.description,
            "from_user_token": pointHistoryRequestEntity.from_user_token,
            "point_history_type": pointHistoryRequestEntity.point_history_type,
        }

        try {
            const { data, error } = await supabase.from("users_point_history").insert(pointHistoryObj).select();

            if (error) {
                console.log("error" + error.code);
                console.log("error" + error.message);
                console.log("error" + error.details);
                console.log("error" + error.hint);
                console.log("error" + error.details);

                throw new Error('유저의 포인트 히스토리를 insert 하는데 실패했습니다.');
            }
            // const { data, error } = await supabase.from('users_point_history')
            //     .insert(pointHistoryRequestEntity).select();

            // if (error) {
            //     console.log("error" + error.code);
            //     console.log("error" + error.message);
            //     console.log("error" + error.details);
            //     console.log("error" + error.hint);
            //     console.log("error" + error.details);

            //     throw new Error('유저의 포인트 히스토리를 insert 하는데 실패했습니다.');
            // }


        } catch (e: any) {
            console.log(e);
            throw new Error('유저의 포인트 히스토리를 insert 하는데 실패했습니다.');
        }

    }

    async uploadProfileImage(userToken: string,file: File): Promise<string> {
        try {

           // const lstPublicUrl: string[] = [];


                const path: string = `profile/${userToken}/${file.name}`;

                const { data, error } = await supabase
                    .storage
                    .from('coderoom')
                    .upload(path, file);
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

    async updateProfileImgUrl(userToken:string, profileUrl: string) {
        try {
            const { error } = await supabase.from('users')
                .update({ profile_url: profileUrl }).eq('user_token', userToken);

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


    async updateAboutMeData(userToken:string, introduceText: string) {
        try {
            const { error } = await supabase.from('users')
                .update({ about_me: introduceText }).eq('user_token', userToken);

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


    async insertBootpayPayment(bootpayPayment: BootPayPaymentEntity) {

     try {
        const { error, data } = await supabase.from('bootpay_payment').insert(bootpayPayment).select();
        if(data){
            console.log(JSON.stringify(data));
        }
        if (error) {
            console.log("error" + error.code);
            console.log("error" + error.message);
            console.log("error" + error.details);
            console.log("error" + error.hint);
            console.log("error" + error.details);

            throw new Error('결제내역 insert에 실패했습니다.');
        }
    } catch (e: any) {
        console.log(e);
        throw new Error('결제내역 insert에 실패했습니다.');
    }
	}

    async updatePostData(codeEditRequestEntity: CodeEditRequestEntity) {
        // post table 수정
        try {
            const { error } = await supabase.from('post')
                .update({ 
                    img_urls: codeEditRequestEntity.img_urls,
                    title:codeEditRequestEntity.title, 
                    description:codeEditRequestEntity.description,
                    category:codeEditRequestEntity.category,
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
            const { error } = await supabase.from('code')
                .update({
                    cost: codeEditRequestEntity.cost,
                    buyer_guide: codeEditRequestEntity.buyer_guide,
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

async getMySaleHistory(myUserToken: string): Promise<PurchaseSaleResponseEntity[] | null> {
    try {
        const { data, error } = await supabase.from('purchase_sale_history')
            .select('*')            
            .eq('sales_user_token', myUserToken,)
            .order('created_at', { ascending: false });
          
            let lstPurchaseSaleData:PurchaseSaleResponseEntity[] = [];

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
    }
    catch (e: any) {
        console.log(e);
        throw new Error('판매 기록을 가져오는 데 실패했습니다.');
    }
}

async getMySaleConfirmedHistory(myUserToken: string, isConfirmed: boolean): Promise<PurchaseSaleResponseEntity[] | null> {
    try {
        const { data, error } = await supabase.from('purchase_sale_history')
            .select('*')            
            .eq('sales_user_token', myUserToken,)
            .eq('is_confirmed', isConfirmed)
            .eq('pay_type','cash')
            .order('created_at', { ascending: false });
          
            let lstPurchaseSaleData:PurchaseSaleResponseEntity[] = [];

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
    }
    catch (e: any) {
        console.log(e);
        throw new Error('정산된 판매 기록을 가져오는 데 실패했습니다.');
    }
}

async getUserCashHistory(myUserToken: string): Promise<CashHistoryResponseEntity[]> {
    try {
        const { data, error } = await supabase.from('users_cash_history')
            .select('*')
            .eq('user_token', myUserToken)
            .order('created_at', { ascending: false });

            let lstCashHistory: CashHistoryResponseEntity[] = [];
            data?.forEach((e) => {
                let cashHistory: CashHistoryResponseEntity = {
                    id: e.id,
                    user_token : e.user_token,
                    cash : e.cash,
                    amount : e.amount,
                    description: e.description,
                    cash_history_type : e.cash_history_type,
                    created_at: e.created_at,
                }
                lstCashHistory.push(cashHistory);
            });
        return lstCashHistory;

    } catch (e: any) {
        console.log(e);
        throw new Error('유저의 캐시 히스토리를 가져오는 데 실패했습니다.');
    }
}


async getUserPointHistory(myUserToken: string): Promise<PointHistoryResponseEntity[]> {
    try {
        const { data, error } = await supabase.from('users_point_history')
            .select('*')
            .eq('user_token', myUserToken)
            .order('created_at', { ascending: false });

            let lstPointHistory: PointHistoryResponseEntity[] = [];
            data?.forEach((e) => {
                let cashHistory: PointHistoryResponseEntity = {
                    id: e.id,
                    user_token : e.user_token,
                    point : e.point,
                    amount : e.amount,
                    description: e.description,
                    point_history_type : e.point_history_type,
                    created_at: e.created_at,
                }
                lstPointHistory.push(cashHistory);
            });
        return lstPointHistory;

    } catch (e: any) {
        console.log(e);
        throw new Error('유저의 포인트 히스토리를 가져오는 데 실패했습니다.');
    }
}




}

export const apiClient = new ApiClient();