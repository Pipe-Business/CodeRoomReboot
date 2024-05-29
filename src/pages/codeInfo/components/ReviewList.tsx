// ReviewList.tsx
import React from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Box } from '@mui/material';
import { PurchaseReviewEntity } from '../../../data/entity/PurchaseReviewEntity';
import SectionTitle from '../../editCode/components/SectionTitle';
import Rating from '@mui/lab/Rating';

interface ReviewListProps {
    reviews: PurchaseReviewEntity[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    return (
        <Box>
            <Box height={100} />
            <SectionTitle title='구매자 후기' helpText='' /> 
            <List>
                {reviews && reviews.map((review) => (
                    <ListItem key={review.id} alignItems="flex-start">
                        {/* <ListItemAvatar>
                            <Avatar src={review.reviewer_profile_pic} />
                        </ListItemAvatar> */}
                        <ListItemText
                            primary={review.review_title}
                            secondary={
                                <>
                                    {/* <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                    >
                                        {review.reviewer_nickname}
                                    </Typography> */}
                                    {/* <br /> */}
                                    {review.review_content}
                                    <br />
                                    <Rating
                                        name="read-only-rating"
                                        value={review.rating}
                                        precision={0.5}
                                        readOnly
                                    />
                                    <br />
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textSecondary"
                                    >
                                        {new Date(review.created_at!).toLocaleString()}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ReviewList;