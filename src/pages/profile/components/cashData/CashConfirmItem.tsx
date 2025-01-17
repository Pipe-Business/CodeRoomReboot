import React, {FC, useCallback} from 'react';
import {Divider, ListItem, ListItemButton, ListItemText} from '@mui/material';
import {useQuery} from '@tanstack/react-query';
import {useNavigate, useParams} from 'react-router-dom';
import {apiClient} from '../../../../api/ApiClient';
import {reformatTime} from '../../../../utils/DayJsHelper';
import {PurchaseSaleRes} from "../../../../data/entity/PurchaseSaleRes";

interface Props {
    children?: React.ReactNode;
    cashConfirmData: PurchaseSaleRes;
}

const CashConfirmItem: FC<Props> = ({ cashConfirmData }) => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const { data: codeData, isLoading } = useQuery({ queryKey: ['codeStore', cashConfirmData.post_id], queryFn: () => apiClient.getTargetCode(cashConfirmData.post_id) });
    const onClickListItem = useCallback((e: any) => {
        e.stopPropagation();

        if(codeData?.isDeleted){
                window.alert('삭제된 게시글입니다.');
        }else{
            if (cashConfirmData) {
                navigate(`/code/${cashConfirmData?.post_id}`);
    
            }
        }
       
    }, [cashConfirmData?.post_id]);
    if (!cashConfirmData?.post_id || isLoading) {
        return <></>;
    }

    return (
        <>
            <ListItemButton onClick={onClickListItem}>
                <ListItem>
                    <ListItemText>
                        <div style={{display: 'flex'}}>

                            <div style={{width: '20%'}}>
                                {reformatTime(cashConfirmData?.created_at!)}
                            </div>

                            <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '50%'
                            }}>{codeData?.title!}</div>

                            <div style={{width: '30%'}}>
                                {codeData?.price!}
                            </div>
                            {/* <div style={{  width:'20%'}}>
                                {cashConfirmData.is_confirmed == "point" ? "코인" : "캐시"}
                            </div> */}

                        </div>
                    </ListItemText>
                </ListItem>

            </ListItemButton>
            <Divider/>
        </>

    );
};
export default CashConfirmItem;