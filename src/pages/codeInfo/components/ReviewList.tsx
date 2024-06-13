import React, { useEffect, useState } from 'react';
import {Box, List, ListItem, ListItemText, Typography, Rating, Divider} from '@mui/material';
import { PurchaseReviewEntity } from '../../../data/entity/PurchaseReviewEntity';
import {fetchReviewsWithNicknames, ReviewWithNickname} from "./ReviewWithNickName";

interface ReviewListProps {
    reviews: PurchaseReviewEntity[];
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews }) => {
    const [reviewsWithNicknames, setReviewsWithNicknames] = useState<ReviewWithNickname[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchReviewsWithNicknames(reviews);
            console.log(`review with nicknames : ${data[0].nickname}`);
            setReviewsWithNicknames(data);
        };

        fetchData();
    }, [reviews]);

    return (
        <Box>
            <Box height={100} />
            <Box display="flex" flexDirection="row" alignItems="center" mb={2}>
                <Typography variant="h5" component="span" fontWeight="bold">구매자 후기</Typography>
                <Box width={16} />
                <Typography component="div">{`(${reviewsWithNicknames.length}개)`}</Typography>
            </Box>
            <List>
                {reviewsWithNicknames && reviewsWithNicknames.map((review) => (
                    <div key={review.id}>
                        <ListItem alignItems="flex-start">
                            <div style={{ display: 'flex', flexDirection: 'column', marginRight: '16px', marginTop: '8px' }}>
                                <Typography
                                    component="span"
                                    variant="h6"
                                    color="textPrimary"
                                    fontWeight={"bold"}
                                >
                                    {review.nickname}
                                </Typography>
                            </div>
                            <ListItemText
                                primary={
                                    <Typography variant="h6" color="textPrimary">
                                        {review.review_title}
                                    </Typography>
                                }
                                secondary={
                                    <>
                                        <Typography variant="body1" color="textSecondary" component="span">
                                            {review.review_content}
                                        </Typography>
                                        <br />
                                        <Rating
                                            name="read-only-rating"
                                            value={review.rating}
                                            precision={0.5}
                                            readOnly
                                            style={{ marginTop: '8px' }}
                                        />
                                        <br />
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textSecondary"
                                            style={{ marginTop: '8px' }}
                                        >
                                            {new Date(review.created_at!).toLocaleString()}
                                        </Typography>
                                    </>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </div>
                ))}
            </List>
        </Box>
    );
};

export default ReviewList;
