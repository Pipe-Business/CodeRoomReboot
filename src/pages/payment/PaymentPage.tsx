import React, {FC, useCallback} from "react";
import MainLayout from "../../layout/MainLayout";
import {Box, Card, CardContent, CardHeader, CircularProgress, IconButton, Typography} from '@mui/material';
import {ArrowBack} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

interface Props {
    children?: React.ReactNode;
}
const PaymentPage: FC<Props> = () => {
    const navigate = useNavigate();

    const onClickBackButton = useCallback(() => {
        navigate(-1);
    }, []);
    return (
        <MainLayout>
            <Box height={32}/>
            <div style={{display:'flex', flexDirection:'row'}}>
            <Card
                elevation={2}
                sx={{
                    width: { xs: '60%', md: '%' },
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: { xs: 2, md: 0 },
                }}
            >
                <CardHeader
                    avatar={
                        <IconButton onClick={onClickBackButton}>
                            <ArrowBack sx={{ fontSize: '32px' }} />
                        </IconButton>
                    }
                    title={
                        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: '#333' }}>
                            결제하기
                        </Typography>
                    }
                />
            </Card>

                <Box width="16px"/>

                <Card sx={{ width: { xs: '40%', md: '%' },}}>
            <Card
                elevation={2}
                sx={{
                    width: { xs: '40%', md: '%' },
                    borderRadius: 2,
                    overflow: 'hidden',
                    mb: { xs: 2, md: 0 },
                }}
            >
                <CardHeader
                    title={
                        <Typography variant="body1" component="div" sx={{ color: '#333' }} style={{fontWeight: 'bold'}}>
                            구매자 정보
                        </Typography>
                    }
                />

            </Card>
                    <Card
                        elevation={2}
                        sx={{
                            width: { xs: '40%', md: '%' },
                            borderRadius: 2,
                            overflow: 'hidden',
                            mb: { xs: 2, md: 0 },
                        }}
                    >
                       <div>
                           <div style={{fontWeight: 'bold', color:'black'}}>코인</div>
                       </div>
                    </Card>
                </Card>
            </div>
        </MainLayout>
    );
}
export default PaymentPage;