import React, { FC, useCallback } from 'react';
import { Divider, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../../../../api/ApiClient';
import { reformatTime } from '../../../../utils/DayJsHelper';

interface Props {
    children?: React.ReactNode;
    saleData: PurchaseSaleResponseEntity;
}

const SaleItem: FC<Props> = ({ saleData }) => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const { data: codeData, isLoading } = useQuery({ queryKey: ['codeStore', saleData.post_id], queryFn: () => apiClient.getTargetCode(saleData.post_id) });
    const onClickListItem = useCallback((e: any) => {
        e.stopPropagation();
        if (saleData) {
            navigate(`/code/${saleData?.post_id}`);

        }
    }, [saleData?.post_id]);
    if (!saleData?.post_id || isLoading) {
        return <></>;
    }

    return (
        <>
            <ListItemButton onClick={onClickListItem}>
                <ListItem>
                    <ListItemText>
                        <div style={{ display: 'flex' }}>

                            <div style={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width:'40%'
                            }}>{codeData?.title!}</div>

                            <div style={{  width:'20%'}}>
                                {saleData.pay_type == "point" ? codeData?.price! * 5 : codeData?.price!}
                            </div>
                            <div style={{  width:'20%'}}>
                                {saleData.pay_type == "point" ? "포인트" : "캐시"}
                            </div>
                            <div style={{  width:'10%'}}>
                               {saleData.is_confirmed ? '정산됨' : '미정산'}
                            </div>
                            <div style={{  width:'10%'}}>
                                {reformatTime(saleData?.created_at!)}
                            </div>
                        </div>
                    </ListItemText>
                </ListItem>

            </ListItemButton>
            <Divider />
        </>

    );
};
export default SaleItem;