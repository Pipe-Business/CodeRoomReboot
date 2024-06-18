import {apiClient} from '../../../api/ApiClient';
import {PurchaseReviewEntity} from "../../../data/entity/PurchaseReviewEntity";
import {UserModel} from "../../../data/model/UserModel";

export interface ReviewWithNickname extends PurchaseReviewEntity {
    nickname: string;
    profile_url: string;
}

export const fetchReviewsWithNicknames = async (reviews: PurchaseReviewEntity[]): Promise<ReviewWithNickname[]> => {
    //console.log(`hello hongchul ${JSON.stringify(reviews)}`);
    const userTokens = reviews.map(review => review.reviewer_user_token);
    const uniqueTokens = Array.from(new Set(userTokens)); // 중복 제거
    //console.log(`uniqueTokens : ${uniqueTokens}`);
    const usersResponse = await apiClient.getUsersByTokens(uniqueTokens); // API 호출 함수 (설명은 아래에)
     //console.log(`user response : ${usersResponse}`);
    // console.log(`user token : ${usersResponse[0].user_token}`);
    // console.log(`user profileUrl : ${usersResponse[0].profile_url}`);
    // console.log(`user email : ${usersResponse[0].email}`);
    const userMap: { [token: string]: string } = {};

    usersResponse.forEach((user: UserModel) => {
        userMap[user.user_token!] = user.nickname;
        //console.log(`user token : ${user.user_token!}`);
        //console.log(`user nickname : ${user.nickname}`);
    });

    return reviews.map(review => ({
        ...review,
        nickname: userMap[review.reviewer_user_token] || 'Unknown',
        profile_url: userMap[review.reviewer_user_token] || 'Unknown',
    }));
};