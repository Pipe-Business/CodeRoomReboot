import React, {FC, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Button, Divider, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../../../api/ApiClient';
import CodeDownloadButton from '../../../codeInfo/components/CodeDownloadButton';
import {REACT_QUERY_KEY} from '../../../../constants/define';
import {PurchaseSaleResponseEntity} from "../../../../data/entity/PurchaseSaleResponseEntity";

interface Props {
    children?: React.ReactNode;
    purchaseData: PurchaseSaleResponseEntity;
    onWriteReviewClick: (purchaseData: PurchaseSaleResponseEntity) => void;
    reviewerUserToken: string;
}

const PurchaseItem: FC<Props> = ({ purchaseData, onWriteReviewClick }) => {
    const { userId } = useParams();
    const { data: codeData } = useQuery({ queryKey: ['codeStore', purchaseData.post_id], queryFn: () => apiClient.getTargetCode(purchaseData.post_id) });
    const navigate = useNavigate();
    const { data: postedUser } = useQuery({
        queryKey: [REACT_QUERY_KEY.user, purchaseData?.sales_user_token, 'nickname'],
        queryFn: () => apiClient.getTargetUser(purchaseData.sales_user_token),
    });

    const { data: reviewData } = useQuery({
        queryKey: ['review', purchaseData.post_id],
        queryFn: () => apiClient.getReviewByPostAndUser(purchaseData.post_id),
    });

    const onClickListItem = useCallback((e: any) => {
        e.stopPropagation();
        if(codeData?.is_deleted){
            window.alert('삭제된 게시글입니다.');
        }else{
            if (purchaseData) {
                navigate(`/code/${codeData?.id}`);
            }
        }
       
    }, [codeData]);

    const handleWriteReviewClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        console.log('handleWriteReviewClick : ' + purchaseData.post_id);
        onWriteReviewClick(purchaseData);    
    }, [onWriteReviewClick, purchaseData]);


    if (!codeData) {
        return <></>;
    }

    return (
        <>
            <ListItemButton onClick={onClickListItem}>
                <ListItem secondaryAction={
                    <>
                        {!userId && codeData.postType === 'code' && <CodeDownloadButton repoURL={codeData.adminGitRepoURL} />}
                        {!reviewData && <Button variant="outlined" onClick={handleWriteReviewClick} style={{ height: '53px', width: '200px' }}>리뷰 작성하기</Button>}
                    </>
                }>
                    <ListItemText
                        primary={codeData?.title}
                        secondary={postedUser?.nickname}
                    />
                </ListItem>
            </ListItemButton>
            <Divider />
        </>
    );
};

export default PurchaseItem;
