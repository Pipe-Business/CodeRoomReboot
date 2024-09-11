import React, {FC} from 'react';
import {
    Box,
    CircularProgress,
    List,
    ListItem,
    ListItemText,
    Paper,
    Tab,
    Tabs,
    Typography,
    useTheme
} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {apiClient} from "../../../../api/ApiClient";
import AdminCashItem from './AdminCashItem';
import CoinHistoryItem from "../../../profile/components/coinHistory/CoinHistoryItem";

type ListType = 'cash' | 'coin';

interface Props {
    children?: React.ReactNode;
    type: ListType;
}

const CenterBox: FC<{ children: React.ReactNode }> = ({children}) => (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
    }}>
        {children}
    </Box>
);

const Header: FC<{ type: ListType }> = ({type}) => {
    const theme = useTheme();

    const headerItems = type === 'cash'
        ? [
            {width: '20%', text: '구매일시', align: 'left'},
            {width: '35%', text: '상품명', align: 'left'},
            {width: '15%', text: '가격', align: 'right'},
            {width: '15%', text: '결제방식', align: 'center'},
            {width: '15%', text: '영수증', align: 'center'}
        ]
        : [
            {width: '20%', text: '일시', align: 'left'},
            {width: '20%', text: '유저', align: 'left'},
            {width: '30%', text: '설명', align: 'left'},
            {width: '15%', text: '코인', align: 'right'},
            {width: '15%', text: '구분', align: 'center'}
        ];

    return (
        <ListItem sx={{backgroundColor: theme.palette.grey[100], py: 2}}>
            <ListItemText>
                <Box display="flex">
                    {headerItems.map((item, index) => (
                        <Typography key={index} variant="subtitle2" sx={{
                            width: item.width,
                            fontWeight: 'bold',
                            textAlign: item.align as "left" | "center" | "right",
                            px: 1
                        }}>
                            {item.text}
                        </Typography>
                    ))}
                </Box>
            </ListItemText>
        </ListItem>
    );
};

const AdminCashPointList: FC<Props> = ({type: initialType}) => {
    const [type, setType] = React.useState<ListType>(initialType);
    const theme = useTheme();

    const {isLoading: isBootpayLoading, data: bootpayData} = useQuery({
        queryKey: ['admin', 'bootpay'],
        queryFn: () => apiClient.getAllBootpayPayment()
    });

    const {isLoading: isCoinLoading, data: coinData} = useQuery({
        queryKey: ['admin', 'userCoinHistory'],
        queryFn: () => apiClient.getAllUserCoinHistory()
    });

    const handleChange = (event: React.SyntheticEvent, newValue: ListType) => {
        setType(newValue);
    };

    if (isBootpayLoading || isCoinLoading) {
        return <CenterBox><CircularProgress/></CenterBox>;
    }

    if (!bootpayData || !coinData) {
        return (
            <Paper elevation={3} sx={{p: 3, textAlign: 'center'}}>
                <Typography variant="h6">No data available</Typography>
            </Paper>
        );
    }

    return (
        <Paper elevation={3}>
            <List>
                <Header type={type}/>
                {type === 'cash'
                    ? bootpayData.map(item => <AdminCashItem item={item} key={item.id}/>)
                    : coinData.map(item => {
                        return <CoinHistoryItem coinHistoryItem={item} key={item.id}/>
                    })
                }
            </List>
        </Paper>
    );
};

export default AdminCashPointList;