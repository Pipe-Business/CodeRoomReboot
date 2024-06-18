// ReviewDialog.tsx
import React, { FC, useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { PurchaseReviewEntity } from '../../../data/entity/PurchaseReviewEntity';
import { apiClient } from '../../../api/ApiClient';
import { useNavigate } from 'react-router-dom';

interface ReviewDialogProps {
    postId: number;
    open: boolean;
    onClose: () => void;
    onReviewSubmit: () => void;
    readonly?: boolean;
    reviewData?: PurchaseReviewEntity; // reviewData prop 추가
}

const ReviewDialog: FC<ReviewDialogProps> = ({ postId, open, onClose, onReviewSubmit, readonly = false, reviewData }) => {
    const [review, setReview] = useState<PurchaseReviewEntity>({
        post_id: postId,
        review_title: '',
        review_content: '',
        rating: 0,
        reviewer_user_token: ''
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            if (readonly && reviewData) {
                // readonly가 true이고 reviewData가 제공되었을 때 reviewData로 상태 설정
                setReview(reviewData);
            } else {
                // 새로운 리뷰 작성일 때 초기화
                setReview({
                    post_id: postId,
                    review_title: '',
                    review_content: '',
                    rating: 0,
                    reviewer_user_token: ''
                });
            }
        }
    }, [open, readonly, reviewData, postId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReview({ ...review, [name]: value });
    };

    const handleRatingChange = (event: React.ChangeEvent<{}>, newValue: number | null) => {
        if (newValue !== null) {
            setReview({ ...review, rating: newValue });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.setReviewData(review);
            alert('소중한 리뷰 감사드립니다 :)');
            onReviewSubmit();
            onClose();
            // navigate(0);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {readonly ? '리뷰 상세 보기' : '구매해주셔서 감사합니다 리뷰를 남겨주시면 포인트가 적립됩니다!'}
            </DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="dense"
                        label="제목"
                        type="text"
                        name="review_title"
                        value={review.review_title}
                        onChange={handleChange}
                        fullWidth
                        required
                        InputProps={{
                            readOnly: readonly,
                        }}
                    />
                    <TextField
                        margin="dense"
                        label="내용"
                        type="text"
                        name="review_content"
                        value={review.review_content}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        required
                        InputProps={{
                            readOnly: readonly,
                        }}
                    />
                    <Box component="fieldset" mb={3} borderColor="transparent">
                        <Rating
                            name="rating"
                            value={review.rating}
                            precision={0.5}
                            onChange={readonly ? undefined : handleRatingChange}
                            readOnly={readonly}
                        />
                    </Box>
                    {!readonly && (
                        <DialogActions>
                            <Button onClick={() => {
                                onClose();
                            }} color="primary">
                                나중에
                            </Button>
                            <Button type="submit" color="primary">
                                작성 완료
                            </Button>
                        </DialogActions>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;
