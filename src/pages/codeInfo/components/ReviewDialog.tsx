// ReviewDialog.tsx
import React, { FC, useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { PurchaseReviewEntity } from '../../../data/entity/PurchaseReviewEntity';
import { apiClient } from '../../../api/ApiClient';

interface ReviewDialogProps {
    postId: number;
    open: boolean;
    onClose: () => void;
}

const ReviewDialog: FC<ReviewDialogProps> = ({ postId, open, onClose }) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiClient.setReviewData(review);
            alert('Review submitted successfully!');
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        margin="dense"
                        label="Post ID"
                        type="number"
                        name="post_id"
                        value={review.post_id}
                        onChange={handleChange}
                        fullWidth
                        disabled
                    />
                    <TextField
                        margin="dense"
                        label="Review Title"
                        type="text"
                        name="review_title"
                        value={review.review_title}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Review Content"
                        type="text"
                        name="review_content"
                        value={review.review_content}
                        onChange={handleChange}
                        fullWidth
                        multiline
                        rows={4}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Rating"
                        type="number"
                        inputProps={{
                            step: 0.1,
                          }}
                        name="rating"
                        value={review.rating}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Reviewer User Token"
                        type="text"
                        name="reviewer_user_token"
                        value={review.reviewer_user_token}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Submit Review
                        </Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;
