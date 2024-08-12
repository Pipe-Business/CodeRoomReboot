import React, {FC, useCallback} from 'react';
import {useQuery} from '@tanstack/react-query';
import {Box, Button, Divider, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../../../api/ApiClient';
import CodeDownloadButton from '../../../codeInfo/components/CodeDownloadButton';
import {REACT_QUERY_KEY} from '../../../../constants/define';
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";

interface Props {
    children?: React.ReactNode;
    purchaseData: PurchaseSaleRes;
    onWriteReviewClick: (purchaseData: PurchaseSaleRes) => void;
    onReadReviewClick: (purchaseData: PurchaseSaleRes) => void;
}

const PurchaseItem: FC<Props> = ({ purchaseData, onWriteReviewClick, onReadReviewClick }) => {
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
        if(codeData?.isDeleted){
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

    const handleReadReviewClick = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation();
        console.log('handleReadReviewClick : ' + purchaseData.post_id);
        onReadReviewClick(purchaseData);
    }, [])

    if (!codeData) {
        return <></>;
    }

    return (
        <>
            <ListItemButton onClick={onClickListItem}>
                <ListItem>
                    <ListItemText
                        primary={codeData?.title}
                        secondary={postedUser?.nickname}
                    />
                    {!userId && codeData.postType === 'code' && <CodeDownloadButton repoURL={codeData.adminGitRepoURL} />}
                    <Box width={16}/>
                    {!reviewData ? <Button variant="outlined" onClick={handleWriteReviewClick} style={{ height: '53px', width: '140px' }}>리뷰 작성</Button> : <Button variant="outlined" onClick={handleReadReviewClick} style={{ height: '53px', width: '140px' }}>리뷰 확인</Button>}
                </ListItem>
            </ListItemButton>
            <Divider />
        </>
    );
};

export default PurchaseItem;
