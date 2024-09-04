import React, {FC, useMemo, useState} from "react";
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    List,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import {REACT_QUERY_KEY} from "../../../../constants/define";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import PaymentPendingDetailItem from "./PaymentPendingDetailItem";
import dayjs from "dayjs";

interface Props {
    item: PurchaseSaleRes[];
    salesUserToken: string;
    selectedMonth: string;
}

interface BulkSettlementStatusUpdateParams {
    salesUserToken: string;
    postIds: number[];
    isCompleted: boolean;
}

const PaymentPendingItem: FC<Props> = ({salesUserToken, item, selectedMonth}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [settlementStatus, setSettlementStatus] = useState<"pending" | "completed">("pending");
    const queryClient = useQueryClient();

    const {data: salesUserData, isLoading: salesUserLoading} = useQuery({
        queryKey: [REACT_QUERY_KEY.user, salesUserToken],
        queryFn: async () => await apiClient.getTargetUser(salesUserToken)
    });

    const {data: userBankAccount, isLoading: isBankAccountLoading} = useQuery({
        queryKey: ['/bankAccount', salesUserToken],
        queryFn: () => apiClient.getUserBankAccountEntity(salesUserToken),
    });

    const updateBulkSettlementStatusMutation = useMutation<void, Error, BulkSettlementStatusUpdateParams>({
        mutationFn: (data: BulkSettlementStatusUpdateParams) =>
            apiClient.updateBulkSettlementStatus(data.salesUserToken, data.postIds, data.isCompleted),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['/purchaseSalehistory']});
        },
    });

    const filteredItems = useMemo(() => {
        if (selectedMonth === 'all') return item;
        return item.filter(sale => {
            const saleDate = dayjs(sale.created_at);
            return saleDate.format('YYYY-MM') === selectedMonth;
        });
    }, [item, selectedMonth]);

    const saleMonthYear = useMemo(() => {
        if (filteredItems.length === 0) return "날짜 없음";
        const dates = filteredItems.map(sale => dayjs(sale.created_at));
        const minDate = dates.reduce((min, curr) => curr.isBefore(min) ? curr : min, dates[0]);
        const maxDate = dates.reduce((max, curr) => curr.isAfter(max) ? curr : max, dates[0]);

        if (minDate.isSame(maxDate, 'month')) {
            return minDate.format('YYYY년 MM월');
        } else {
            return `${minDate.format('YYYY년 MM월')} - ${maxDate.format('YYYY년 MM월')}`;
        }
    }, [filteredItems]);

    const completedCount = useMemo(() => {
        return filteredItems.filter(item => item.confirmed_time).length;
    }, [filteredItems]);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    const handleSettlementStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSettlementStatus(event.target.value as "pending" | "completed");
    };

    const handleConfirmStatusChange = async () => {
        const postIds = filteredItems.map(item => item.post_id);
        await updateBulkSettlementStatusMutation.mutateAsync({
            salesUserToken,
            postIds,
            isCompleted: settlementStatus === "completed"
        });
        handleCloseDialog();
    };

    if (salesUserLoading || isBankAccountLoading) {
        return <div>로딩중...</div>;
    }

    if (filteredItems.length === 0) {
        return null;
    }

    return (
        <>
            <Accordion sx={{width: '100%'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={`${salesUserToken}-content`}
                    id={`${salesUserToken}-header`}
                >
                    <Box display="flex" flexDirection="column" width="100%">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6">{salesUserData?.nickname}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {`${completedCount}/${filteredItems.length} 정산 완료`}
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Typography variant="body2" color="text.secondary" mr={2}>
                                {salesUserData?.email}
                            </Typography>
                            <Box display="flex" alignItems="center">
                                <AccountBalanceIcon fontSize="small" sx={{mr: 0.5}}/>
                                <Typography variant="body2" color="text.secondary">
                                    {`${userBankAccount?.bank ?? ''}은행 ${userBankAccount?.account_number} (${userBankAccount?.name})`}
                                </Typography>
                            </Box>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            판매 기간: {saleMonthYear}
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box display="flex" flexDirection="column" gap={2}>
                        {filteredItems.map((saleItem, index) => (
                            <PaymentPendingDetailItem key={index} item={saleItem}/>
                        ))}
                    </Box>
                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                            정산 상태 일괄 변경
                        </Button>
                    </Box>
                </AccordionDetails>
            </Accordion>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>정산 상태 일괄 변경</DialogTitle>
                <DialogContent>
                    <RadioGroup
                        aria-label="settlement-status"
                        name="settlement-status"
                        value={settlementStatus}
                        onChange={handleSettlementStatusChange}
                    >
                        <FormControlLabel value="pending" control={<Radio/>} label="정산 대기"/>
                        <FormControlLabel value="completed" control={<Radio/>} label="정산 완료"/>
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>취소</Button>
                    <Button onClick={handleConfirmStatusChange} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PaymentPendingItem;