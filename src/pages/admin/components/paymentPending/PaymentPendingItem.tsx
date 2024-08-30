import React, {FC} from "react";
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {Box, List, Typography} from "@mui/material";
import AccordionDetails from "@mui/material/AccordionDetails";
import Accordion from "@mui/material/Accordion";
import {REACT_QUERY_KEY} from "../../../../constants/define";
import {useQuery} from "@tanstack/react-query";
import {apiClient} from "../../../../api/ApiClient";
import PaymentPendingDetailItem from "./PaymentPendingDetailItem";
import Button from "@mui/material/Button";


interface Props {
    item: PurchaseSaleRes[];
    salesUserToken:string;
}

const PaymentPendingItem: FC<Props> = ({ salesUserToken ,item}) => {
    //TODO 정산 구현 필요
////const { settleCashMutate } = useMutateSettleCashBySeller();
// 	const { settleCoinMutate } = useMutateSettleCoinBySeller();
//     const { updatePayConfirmedMutate } = useMutateUpdateConfirmedStatus();

    const { data: salesUserData, isLoading: salesUserLoading } = useQuery({
        queryKey: [REACT_QUERY_KEY.user, salesUserToken],
        queryFn: async() => await apiClient.getTargetUser(salesUserToken)
    })

    const {data: userBankAccount, isLoading: isBankAccountLoading} = useQuery({
        queryKey: ['/bankAccount', salesUserToken],
        queryFn: () => apiClient.getUserBankAccountEntity(salesUserToken),
    });

    if(isBankAccountLoading) {
        return (<>로딩</>);
    }
    return (
        <div>
        <Accordion key={salesUserToken}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`${salesUserToken}-content`}
                id={`${salesUserToken}-header`}
            >
                <div style={{flexDirection:'row', display:'flex'}}>
                <Typography>{`신청자: ${salesUserData?.nickname}`}</Typography>
                <Box width={"12px"}/>
                <Typography>{salesUserData?.email}</Typography>
                </div>
                <Box width={"24px"}/>
                <div>
                    {
                        `${userBankAccount?.bank}은행 / 
                    ${userBankAccount?.account_number} / 
                    ${userBankAccount?.name}`
                    }
                </div>
                <Box width={"24px"}/>
                <Button variant={'outlined'}>정산 완료</Button>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {item.map((item) => (
                        <PaymentPendingDetailItem item={item} />
                    ))}
                </List>
            </AccordionDetails>
        </Accordion>
            <Box height={"32px"}/>
        </div>
    );
};

export default PaymentPendingItem;