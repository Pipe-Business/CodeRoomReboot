import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../../../api/ApiClient";
import { useQueryUserLogin } from "../../../../hooks/fetcher/UserFetcher";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl, Grid,
    MenuItem, Paper,
    Select,
    SelectChangeEvent,
    Table,
    TableContainer, Typography,
} from "@mui/material";
import TableHeader from "../TableHeader";
import ProfitList from "./ProfitList";
import { MyPageTabPageBtn } from "../../styles";
import ListEmptyText from "../ListEmptyText";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import { toast } from "react-toastify";
import { createTodayDate } from "../../../../utils/DayJsHelper";
import { PurchaseSaleRes } from "../../../../data/entity/PurchaseSaleRes";
import { useNavigate } from "react-router-dom";
import SettlementInfoDialog, { UserBankAccountEntity } from './SettlementInfoDialog';

const ProfitTabPage = () => {
    const { userLogin } = useQueryUserLogin();
    const { data: salesData, isLoading: isSalesCodeDataLoading } = useQuery({
        queryKey: ['/sales', userLogin?.user_token!],
        queryFn: () => apiClient.getMySaleHistory(userLogin!.user_token!),
    });

    const { data: userBankAccount, isLoading: isBankAccountLoading } = useQuery({
        queryKey: ['/bankAccount', userLogin?.user_token!],
        queryFn: () => apiClient.getUserBankAccountEntity(userLogin!.user_token!),
    });

    const [monthFilter, setMonthFilter] = useState<string[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const handleTermChange = (event: SelectChangeEvent) => {
        setSelectedPeriod(event.target.value as string);
    }

    const navigate = useNavigate();

    const [filteredSalesData, setFilteredSalesData] = useState<PurchaseSaleRes[]>();
    const [totalSalesAmount, setTotalSalesAmount] = useState<number>(0);

    useEffect(() => {
        const filteredList: PurchaseSaleRes[] = [];
        let totalSalesAmountSum = 0;

        if(selectedPeriod) {
            salesData?.forEach((sale) => {
                const parsedDate: Date = new Date(sale.created_at!);
                const parsedYear = parsedDate.getFullYear().toString();
                const parsedMonth = (parsedDate.getMonth() + 1).toString().padStart(2, '0');

                const selectedYear = selectedPeriod.split("년 ")[0];
                const selectedMonth = selectedPeriod.split("년 ")[1].split("월")[0];

                if (parsedYear === selectedYear && parsedMonth === selectedMonth) {
                    filteredList.push(sale);
                    totalSalesAmountSum += sale.sell_price;
                }
            });
        }

        setFilteredSalesData(filteredList);
        setTotalSalesAmount(totalSalesAmountSum);
    }, [salesData, selectedPeriod]);

    useEffect(() => {
        const monthFilterSet = new Set<string>();

        salesData?.forEach((sale) => {
            const parsedDate:Date = new Date(sale.created_at!);
            const year = parsedDate.getFullYear();
            const month = (parsedDate.getMonth() + 1).toString().padStart(2,'0');
            monthFilterSet.add(`${year}년 ${month}월`);
        });

        const monthFilterArray: string[] = Array.from(monthFilterSet);
        setMonthFilter(monthFilterArray);
        setSelectedPeriod(monthFilterArray[0]);
    }, [salesData]);

    const [settlementPeriod, setSettlementPeriod] = useState<string>();
    const [allowedSettlementApplyAmount, setAllowedSettlementApplyAmount] = useState<number>();
    const [showModalContent, setShowSettlementModalContent] = useState(true);

    useEffect(() => {
        const monthFilterSet = new Set<string>();
        let allowedSettlementApplyAmountSum: number = 0;

        salesData?.forEach((sale) => {
            if(sale.confirmed_time === null){
                const parsedDate:Date = new Date(sale.created_at!);
                const year = parsedDate.getFullYear();
                const month = (parsedDate.getMonth() + 1).toString().padStart(2,'0');
                monthFilterSet.add(`${year}년 ${month}월`);
                allowedSettlementApplyAmountSum += sale.sell_price * 0.8;
            }
            const monthFilterArray: string[] = Array.from(monthFilterSet);
            const period = `${monthFilterArray[monthFilterArray.length-1]} ~ ${monthFilterArray[0]}`;
            if(!monthFilterArray[monthFilterArray.length-1]){
                setShowSettlementModalContent(false);
            }
            setSettlementPeriod(period);
            setAllowedSettlementApplyAmount(allowedSettlementApplyAmountSum);
        });
    }, [salesData]);

    // 새로운 상태와 핸들러 추가
    const [isSettlementInfoDialogOpen, setIsSettlementInfoDialogOpen] = useState(false);
    const [isApplyForSettlementDialogOpen, setIsApplyForSettlementDialogOpen] = useState(false);

    const handleOpenSettlementInfoDialog = () => {
        setIsSettlementInfoDialogOpen(true);
    };

    const handleCloseSettlementInfoDialog = () => {
        setIsSettlementInfoDialogOpen(false);
    };

    const handleOpenApplyForSettlementDialog = () => {
        setIsApplyForSettlementDialogOpen(true);
    };

    const handleCloseApplyForSettlementDialog = () => {
        setIsApplyForSettlementDialogOpen(false);
    };

    const handleSaveSettlementInfo = async (updatedInfo: UserBankAccountEntity & { file?: File }) => {
        try {
            if (updatedInfo.file) {
                await apiClient.deleteAllBankUrlImageInFolder(userLogin?.user_token!);
                const date = createTodayDate();
                const path = `user_bank_account/${userLogin?.user_token}/${date}`;
                const imageUrl = await apiClient.uploadImage(userLogin!.user_token!, updatedInfo.file, path);
                updatedInfo.copy_of_bank_statement_img_url = imageUrl;
            }

            const userBankInfo: UserBankAccountEntity = {
                ...updatedInfo,
                user_token: userLogin?.user_token!,
            };

            if (userBankAccount?.id) {
                await apiClient.updateUserBankInfo(userBankAccount.id, userBankInfo);
            } else {
                await apiClient.insertUserBankInfo(userBankInfo);
            }

            toast.success("저장되었습니다");
            handleCloseSettlementInfoDialog();
        } catch (error) {
            console.error("Error saving settlement info:", error);
            toast.error("저장 중 오류가 발생했습니다");
        }
    };


    if (salesData?.length === 0) {
        return <ListEmptyText />;
    }

    if (isSalesCodeDataLoading || isBankAccountLoading || monthFilter[0] === undefined) {
        return <ListLoadingSkeleton />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>판매 년도,월 선택</Typography>
                    <FormControl fullWidth size="small">
                        <Select
                            value={selectedPeriod}
                            onChange={handleTermChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            {monthFilter.map((m, index) => (
                                <MenuItem key={index} value={m}>{m}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <MyPageTabPageBtn onClick={handleOpenSettlementInfoDialog}>정산 정보</MyPageTabPageBtn>
                    <Box width="16px"/>
                    {/*<MyPageTabPageBtn onClick={handleOpenApplyForSettlementDialog}>정산 신청</MyPageTabPageBtn>*/}
                </Grid>
            </Grid>

            <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            총 판매 금액
                        </Typography>
                        <Typography variant="h4" color="primary">
                            {totalSalesAmount.toLocaleString()}원
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="h6" gutterBottom>
                            총 정산 금액
                        </Typography>
                        <Typography variant="h4" color="secondary">
                            {(totalSalesAmount * 0.8).toLocaleString()}원
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHeader headerList={["판매일시", "코드제목", "구매자", "판매금액", "정산금액"]}/>
                    <ProfitList purchaseData={filteredSalesData!}/>
                </Table>
            </TableContainer>

            <SettlementInfoDialog
                open={isSettlementInfoDialogOpen}
                onClose={handleCloseSettlementInfoDialog}
                userBankAccount={userBankAccount!}
                onSave={handleSaveSettlementInfo}
            />
        </Box>
    );
}

export default ProfitTabPage;