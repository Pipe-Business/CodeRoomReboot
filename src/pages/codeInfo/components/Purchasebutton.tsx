import React, { FC } from "react";
import { Button, Typography, useTheme } from "@mui/material";
import { LocalAtm as PaymentIcon } from "@mui/icons-material";
import { useQueryUserLogin } from "../../../hooks/fetcher/UserFetcher";
import { CodeModel } from "../../../data/model/CodeModel";
import { PurchaseSaleRes } from "../../../data/entity/PurchaseSaleRes";

interface Props {
    postData: CodeModel;
    purchasedSaleData?: PurchaseSaleRes | null;
    handlePurchase: () => void;
}

const PurchaseButton: FC<Props> = ({ purchasedSaleData, postData, handlePurchase }) => {
    const { userLogin } = useQueryUserLogin();
    const theme = useTheme();

    // 게시자이거나 이미 구매한 경우 버튼을 렌더링하지 않음
    if (userLogin?.user_token === postData.userToken || purchasedSaleData != null) {
        return null;
    }

    return (
        <Button
            variant="contained"
            color="primary"
            onClick={handlePurchase}
            startIcon={<PaymentIcon />}
            sx={{
                width: '100%',
                maxWidth: '300px',
                height: '50px',
                borderRadius: '25px',
                fontWeight: 'bold',
                textTransform: 'none',
                fontSize: '16px',
                boxShadow: theme.shadows[3],
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[5],
                    backgroundColor: theme.palette.primary.dark,
                },
            }}
        >
            <Typography variant="button">
                코드 구매하기
            </Typography>
        </Button>
    );
}

export default PurchaseButton;