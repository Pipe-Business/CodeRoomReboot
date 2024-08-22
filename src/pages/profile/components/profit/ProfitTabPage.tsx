import {useQuery} from "@tanstack/react-query";
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
import React, {ChangeEvent, Fragment, useCallback, useState} from "react";
import ProfitList from "./ProfitList";
import {MyPageTabPageBtn, TotalAmountTitleText} from "../../styles";
import useDialogState from "../../../../hooks/UseDialogState";
import CloseIcon from "@mui/icons-material/Close";
import useDialog from "../../../../hooks/useDialog";

const ProfitTabPage = () => {
    const {userLogin} = useQueryUserLogin();
    const {data: purchaseData, isLoading: isPurchaseCodeDataLoading, refetch: refetchPurchaseData} = useQuery({
        queryKey: ['/sales', userLogin?.user_token!],
        queryFn: () => apiClient.getMySaleHistory(userLogin!.user_token!),
    });
    const [term, setTerm] = useState("2024-08-00 00:00:00.136465+00");
    const handleTermChange = (event:SelectChangeEvent) => {
        setTerm(event.target.value as string);
    }

    const [open, handleOpenDialog, handleCloseDialog, setOpen] = useDialogState();
    const { isDialogOpen: isInfoEditDialog, handleOpenDialog:handleInfoEditOpenDialog, handleCloseDialog:handleInfoEditCloseDialog, setIsDialogOpen:setIsInfoEditDialog} = useDialog();

    const [src, setSrc] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleChangeImage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let url: string = '';
        const file = Array.from(e.target.files ?? []);
        url = URL.createObjectURL(file[0]);
        setFile(file[0]);
        setSrc(url);
    }, []);

    return (
        <TableContainer>
            <div style={{display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems: 'center'}}>
                <div>
                    <div>년도/월 선택</div>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                        <Select
                            value={term}
                            displayEmpty
                            onChange={handleTermChange}
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            <MenuItem value={'2024-08-00 00:00:00.136465+00'}>2024년 8월</MenuItem>
                            <MenuItem value={'2024-07-00 00:00:00.136465+00'}>2024년 7월</MenuItem>
                            <MenuItem value={'2024-06-00 00:00:00.136465+00'}>2024년 6월</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div>
                    <TotalAmountTitleText>누적 수익 금액 : 215,000원 </TotalAmountTitleText>
                    <TotalAmountTitleText>정산 신청 가능 금액 : 15,000원</TotalAmountTitleText>
                </div>
                <div style={{display:'flex', flexDirection:'row', justifyContent:'center', alignItems: 'center'}}>
                    <MyPageTabPageBtn onClick={handleOpenDialog}>내 정산정보</MyPageTabPageBtn>
                    <Box width="32px"/>
                    <MyPageTabPageBtn>정산 신청</MyPageTabPageBtn>
                </div>
            </div>
            <div style={{fontSize:'24px', fontWeight:'bold'}}>
                이번 달 총 판매 수익 : 200원
            </div>
            <Box height={'64px'} />


            <Table>
                <TableHeader  headerList={["판매일시","코드제목","구매자","판매금액","실제 수입","정산 상태 (대기/완료)"]}/>
                <ProfitList  purchaseData={purchaseData!}/>
            </Table>

            {open &&
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
                            홍길동
                        </DialogContentText>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '52px', paddingLeft: '24px'}}>
                            은행
                        </DialogContentText>
                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            국민
                        </DialogContentText>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            계좌번호
                        </DialogContentText>
                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            1212-1212-1212
                        </DialogContentText>
                    </div>
                    <Box height={'32px'} />
                    <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px',whiteSpace:'pre-line'}}>
                        {`수익금은 '입금 신청'을 한 다음 달 15일에 입금됩니다.
                            15일이 영업일이 아닌 경우 다음 영업일에 입금됩니다.`}
                    </DialogContentText>
                    <DialogActions>
                        <MyPageTabPageBtn onClick={handleCloseDialog}>수정하기</MyPageTabPageBtn>
                    </DialogActions>
                </Dialog>}

            {open &&
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
                            홍길동
                        </DialogContentText>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '52px', paddingLeft: '24px'}}>
                            은행
                        </DialogContentText>
                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            국민
                        </DialogContentText>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px'}}>
                            계좌번호
                        </DialogContentText>
                        <DialogContentText sx={{color: 'black', fontWeight: 'bold', fontSize: '19px'}}>
                            1212-1212-1212
                        </DialogContentText>
                    </div>
                    <Box height={'32px'} />
                    <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px',whiteSpace:'pre-line'}}>
                        {`수익금은 '입금 신청'을 한 다음 달 15일에 입금됩니다.
                            15일이 영업일이 아닌 경우 다음 영업일에 입금됩니다.`}
                    </DialogContentText>
                    <DialogActions>
                        <MyPageTabPageBtn onClick={() => {
                            handleCloseDialog();
                            handleInfoEditOpenDialog();
                        }}>수정하기</MyPageTabPageBtn>
                    </DialogActions>
                </Dialog>}
            {/*TODO: 리팩토링 필요*/}
            {isInfoEditDialog &&
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
                        <input type="file" onChange={handleChangeImage} accept="image/*"
                               style={{marginTop: '8px'}}/>
                    </div>
                    <Box height={'32px'}/>
                    <DialogContentText sx={{paddingRight: '24px', paddingLeft: '24px', whiteSpace: 'pre-line'}}>
                        {`수익금은 '입금 신청'을 한 다음 달 15일에 입금됩니다.
                            15일이 영업일이 아닌 경우 다음 영업일에 입금됩니다.`}
                    </DialogContentText>
                    <DialogActions>
                        <MyPageTabPageBtn onClick={handleInfoEditCloseDialog}>저장하기</MyPageTabPageBtn>
                        {/* TODO: 저장하기 */}
                    </DialogActions>
                </Dialog>}
        </TableContainer>
    );
}
export default ProfitTabPage;