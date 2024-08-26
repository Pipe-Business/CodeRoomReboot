import {useMutation, useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import {useQueryUserLogin} from "../../../../hooks/fetcher/UserFetcher";
import {
    Box,
    Dialog,
    DialogActions,
    DialogContentText,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Table,
    TableContainer, TextField
} from "@mui/material";
import TableHeader from "../TableHeader";
import React, {ChangeEvent, useCallback, useState} from "react";
import ProfitList from "./ProfitList";
import {MyPageTabPageBtn, TotalAmountTitleText} from "../../styles";
import useDialogState from "../../../../hooks/UseDialogState";
import CloseIcon from "@mui/icons-material/Close";
import useDialog from "../../../../hooks/useDialog";
import ListEmptyText from "../ListEmptyText";
import ListLoadingSkeleton from "../ListLoadingSkeleton";
import {UserBankAccountEntity} from "../../../../data/entity/UserBankAccountEntity";
import {useInputValidate} from "../../../../hooks/common/UseInputValidate";
import {toast} from "react-toastify";
import {createTodayDate} from "../../../../utils/DayJsHelper";

const ProfitTabPage = () => {
    const {userLogin} = useQueryUserLogin();
    const {data: purchaseData, isLoading: isPurchaseCodeDataLoading} = useQuery({
        queryKey: ['/sales', userLogin?.user_token!],
        queryFn: () => apiClient.getMySaleHistory(userLogin!.user_token!),
    });

    const {data: userBankAccount, isLoading: isBankAccountLoading} = useQuery({
        queryKey: ['/bankAccount', userLogin?.user_token!],
        queryFn: () => apiClient.getUserBankAccountEntity(userLogin!.user_token!),
    });
    const [term, setTerm] = useState("2024-08-00 00:00:00.136465+00");
    const handleTermChange = (event: SelectChangeEvent) => {
        setTerm(event.target.value as string);
    }

    //TODO : DialogState hook을 배열이 아닌 객체로 리턴하는 방식으로 모두 변경해야 함.
    const [open, handleOpenDialog, handleCloseDialog, setOpen] = useDialogState();
    const {
        isDialogOpen: isInfoEditDialog,
        handleOpenDialog: handleInfoEditOpenDialog,
        handleCloseDialog: handleInfoEditCloseDialog,
        setIsDialogOpen: setIsInfoEditDialog
    } = useDialog();

    const {
        isDialogOpen: isApplyForSettlementDialogOpen,
        handleOpenDialog: handleApplyForSettlementopenDialog,
        handleCloseDialog: handleApplyForSettlementCloseDialog,
        setIsDialogOpen: setIsApplyForSettlementDialog
    } = useDialog();

    const [src, setSrc] = useState<string | null>();
    const [file, setFile] = useState<File | null>(null);

    const handleChangeImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let url: string = '';
        const file = Array.from(e.target.files ?? []);
        url = URL.createObjectURL(file[0]);
        setFile(file[0]);
        setSrc(url);
    }, []);

    const handleUserBankInfoDialogEditBtn = () => {
        handleCloseDialog();
        handleInfoEditOpenDialog();
    }

    //TODO : 객체로 리턴하도록 변경 필요..

    const [inputName, setInputName] = useState<string>();
    const [inputBank, setInputBank] = useState<string>();
    const [inputAccountNumber, setInputAccountNumber] = useState<string>();

    const onChangeName = (e: ChangeEvent<HTMLInputElement>) => {
        setInputName(e.target.value);
    }

    const onChangeBank = (e: ChangeEvent<HTMLInputElement>) => {
        setInputBank(e.target.value);
    }

    const onChangeAccountNumber = (e: ChangeEvent<HTMLInputElement>) => {
        setInputAccountNumber(e.target.value);
    }

    const isOpenUserBankInfoDialog = userBankAccount && open;
    const isOpenEditUserBankInfoDialog = !userBankAccount || isInfoEditDialog;
    const handleUserBankInfoShowBtn = () => {
        userBankAccount ? handleOpenDialog() : handleInfoEditOpenDialog();
        setInputName(userBankAccount?.name ?? '');
        setInputBank(userBankAccount?.bank ?? '');
        setInputAccountNumber(userBankAccount?.account_number ?? '');
        setSrc(userBankAccount?.copy_of_bank_statement_img_url ?? '');
    }



    const handleSaveUserBankInfoBtn = async () => {
        // TODO 변경된 내용이 없습니다 처리 필요
        if (!file) {
            toast.error('통장 사본 이미지를 첨부해주세요');
            return;
        }

        // upload 시 기존 사진 삭제
        await apiClient.deleteAllBankUrlImageInFolder(userLogin?.user_token!);

        const date = createTodayDate();
        const path: string = `user_bank_account/${userLogin?.user_token}/${date}`;
        const imageUrl = await apiClient.uploadImage(userLogin?.user_token!, file, path); // 이미지 스토리지 업로드

        const userBankInfo: UserBankAccountEntity = {
            user_token: userLogin?.user_token!,
            name: inputName!,
            bank: inputBank!,
            account_number: inputAccountNumber!,
            copy_of_bank_statement_img_url: imageUrl,
        }
        if(userBankAccount){
            console.log("update!!!");
            await apiClient.updateUserBankInfo( userBankAccount.id!, userBankInfo);
        }else {
            await apiClient.insertUserBankInfo(userBankInfo);
        }
        handleInfoEditCloseDialog();
        toast.success("저장되었습니다");
    }

    if (isPurchaseCodeDataLoading || isBankAccountLoading) {
        return <ListLoadingSkeleton/>;
    }

    if (purchaseData?.length === 0) {
        return <ListEmptyText/>;
    }

    return (
        <TableContainer>
            <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                    <div>년도/월 선택</div>
                    <FormControl sx={{m: 1, minWidth: 120}} size="small">
                        <Select
                            value={term}
                            displayEmpty
                            onChange={handleTermChange}
                            inputProps={{'aria-label': 'Without label'}}
                        >
                            <MenuItem value={'2024-08-00 00:00:00.136465+00'}>2024년 8월</MenuItem>
                            <MenuItem value={'2024-07-00 00:00:00.136465+00'}>2024년 7월</MenuItem>
                            <MenuItem value={'2024-06-00 00:00:00.136465+00'}>2024년 6월</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                {/*<div>*/}
                {/*    /!*<TotalAmountTitleText>누적 수익 금액 : 215,000원 </TotalAmountTitleText>*!/*/}
                {/*    <TotalAmountTitleText>정산 신청 가능 금액 : 15,000원</TotalAmountTitleText>*/}
                {/*</div>*/}
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                    <MyPageTabPageBtn onClick={handleUserBankInfoShowBtn}>내 정산정보</MyPageTabPageBtn>
                    <Box width="32px"/>
                    <MyPageTabPageBtn onClick={handleApplyForSettlementopenDialog}>정산 신청</MyPageTabPageBtn>
                </div>
            </div>
            <div style={{fontSize: '24px', fontWeight: 'bold'}}>
                {/*TODO 필터링 및 DB 연동*/}
                8월 총 판매 금액 : 200원
            </div>
            <Box height={'64px'}/>


            <Table>
                <TableHeader headerList={["판매일시", "코드제목", "구매자", "판매금액", "정산 상태 (대기/완료)"]}/>
                <ProfitList purchaseData={purchaseData!}/>
            </Table>

            {isOpenUserBankInfoDialog &&
                <Dialog
                    open={open}
                    onClose={handleCloseDialog}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <DialogTitle>내 정산정보</DialogTitle>
                        <CloseIcon onClick={handleCloseDialog} sx={{color: 'gray', padding: '10px'}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            예금주명
                        </DialogContentText>
                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            {userBankAccount?.name}
                        </DialogContentText>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '52px', paddingLeft: '24px'}}>
                            은행
                        </DialogContentText>
                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            {userBankAccount?.bank}
                        </DialogContentText>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            계좌번호
                        </DialogContentText>
                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            {userBankAccount?.account_number}
                        </DialogContentText>
                    </div>
                    <Box height={'32px'}/>
                    <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px', whiteSpace: 'pre-line'}}>
                        {`수익금은 '입금 신청'을 한 다음 달 15일에 입금됩니다.
                            15일이 영업일이 아닌 경우 다음 영업일에 입금됩니다.`}
                    </DialogContentText>
                    <DialogActions>
                        <MyPageTabPageBtn onClick={handleUserBankInfoDialogEditBtn}>수정하기</MyPageTabPageBtn>
                    </DialogActions>
                </Dialog>}
            {/*TODO: 리팩토링 필요*/}
            {isOpenEditUserBankInfoDialog &&
                <Dialog
                    open={isInfoEditDialog}
                    onClose={handleInfoEditCloseDialog}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <DialogTitle>내 정산정보 수정</DialogTitle>
                        <CloseIcon onClick={handleInfoEditCloseDialog} sx={{color: 'gray', padding: '10px'}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            예금주명
                        </DialogContentText>
                        <TextField
                            value={inputName}
                            onChange={onChangeName}
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            type="text"
                            variant="standard"
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '52px', paddingLeft: '24px'}}>
                            은행
                        </DialogContentText>
                        <TextField
                            value={inputBank}
                            onChange={onChangeBank}
                            autoFocus
                            required
                            margin="dense"
                            id="bank"
                            type="text"
                            variant="standard"
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            계좌번호
                        </DialogContentText>
                        <TextField
                            value={inputAccountNumber}
                            onChange={onChangeAccountNumber}
                            autoFocus
                            required
                            margin="dense"
                            id="bank account"
                            type="text"
                            variant="standard"
                        />
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            통장 사본 이미지
                        </DialogContentText>
                        {src && (
                            <>
                                <img src={src} alt={"통장사본 이미지"} width={'36px'} height={'36px'}/>
                            </>
                        ) 
                        }
                        <input type="file" onChange={handleChangeImage} accept="image/*"
                               style={{marginTop: '8px'}}/>
                    </div>
                    <Box height={'32px'}/>
                    <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px', whiteSpace: 'pre-line'}}>
                        {`수익금은 '입금 신청'을 한 다음 달 15일에 입금됩니다.
                            15일이 영업일이 아닌 경우 다음 영업일에 입금됩니다.`}
                    </DialogContentText>
                    <DialogActions>
                        <MyPageTabPageBtn onClick={handleSaveUserBankInfoBtn}>저장하기</MyPageTabPageBtn>
                    </DialogActions>
                </Dialog>}


            {isApplyForSettlementDialogOpen &&
                <Dialog
                    open={isApplyForSettlementDialogOpen}
                    onClose={handleApplyForSettlementCloseDialog}
                >
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <DialogTitle>정산 신청</DialogTitle>
                        <CloseIcon onClick={handleApplyForSettlementCloseDialog} sx={{color: 'gray', padding: '10px'}}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            정산 기간:
                        </DialogContentText>

                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            {`2024.07 ~ 2024.08`}
                        </DialogContentText>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            정산 신청 가능 금액:
                        </DialogContentText>

                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            {`15,000원`}
                            {/*    TODO: db 연동 필요*/}
                        </DialogContentText>
                    </div>
                    <Box height={'32px'}/>
                    <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px', whiteSpace: 'pre-line'}}>
                        {`정산 신청 가능 금액은 출금 수수료를 제외한 금액입니다.`}
                    </DialogContentText>
                    <DialogActions>
                        <MyPageTabPageBtn onClick={handleApplyForSettlementCloseDialog}>정산 신청</MyPageTabPageBtn>
                    </DialogActions>
                </Dialog>}
        </TableContainer>
    );
}
export default ProfitTabPage;