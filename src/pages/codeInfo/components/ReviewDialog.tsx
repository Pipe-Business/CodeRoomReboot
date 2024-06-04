// ReviewDialog.tsx
import React, { FC, useState, useEffect } from 'react';
import Rating from '@mui/lab/Rating';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import { PurchaseReviewEntity } from '../../../data/entity/PurchaseReviewEntity';
import { apiClient } from '../../../api/ApiClient';

interface ReviewDialogProps {
    postId: number;
    open: boolean;
    onClose: () => void;
    onReviewSubmit: () => void;
}

const ReviewDialog: FC<ReviewDialogProps> = ({ postId, open, onClose, onReviewSubmit }) => { 
    const [review, setReview] = useState<PurchaseReviewEntity>({
        post_id: postId,
        review_title: '',
        review_content: '',
        rating: 0,
        reviewer_user_token: ''
    });

    useEffect(() => {
        setReview((prevReview) => ({ ...prevReview, post_id: postId }));
    }, [postId]);

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
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>구매해주셔서 감사합니다 리뷰를 남겨주시면 포인트가 적립됩니다!</DialogTitle>
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
                    />
                    <Box component="fieldset" mb={3} borderColor="transparent">
                        <Rating
                            name="rating"
                            value={review.rating}
                            precision={0.5}
                            onChange={handleRatingChange}
                        />
                    </Box>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            나중에
                        </Button>
                        <Button type="submit" color="primary">
                            작성 완료
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;
