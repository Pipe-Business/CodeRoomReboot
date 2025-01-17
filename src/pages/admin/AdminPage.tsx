import React, {FC, useEffect} from 'react';
import AdminLayout from '../../layout/AdminLayout';
import {Box} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import AdminPaymentPendingPage from './AdminPaymentPendingPage';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import AdminCodeRequestList from './components/codeRequest/AdminCodeRequestList';
import {supabase} from "../../api/ApiClient";
import AdminCashPointPage from './AdminCashPointPage';
import UserManageList from './components/userManage/UserManageList';
import {PostStateType} from "../../enums/PostStateType";

interface Props {
	children?: React.ReactNode;
}

const AdminPage: FC<Props> = () => {
	const [value, setValue] = React.useState('1');
	const location = useLocation();
	const navigate = useNavigate();
	const tab = location.state?.tab;
	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {

		const getSession = async () => {
			const { data, error } = await supabase.auth.getSession()
			if (error) {
				console.error(error)
			} else {
				const { data: { user } } = await supabase.auth.getUser();
				
				if(!user || user.id != "cb8378c7-5531-43e0-882d-0f84e19f03ad"){ // 관리자의 유저토큰인지 확인
					// console.log('here!!')
					navigate('/admin/login');
				}else{
					//console.log('not here!!')
				}

				
			}
		}
		getSession()


		setValue(searchParams.get('tab') ?? '1');
	}, [navigate, searchParams]); // 의존성 배열에 navigate와 searchParams 추가


	const handleChange = (_: React.SyntheticEvent, newValue: string) => {
		searchParams.set('tab', newValue);
		setSearchParams(searchParams);
		setValue(newValue);
	};

	return (
		<AdminLayout>
			{tab}
			<TabContext value={value}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<TabList onChange={handleChange} aria-label='lab API tabs example'>
						<Tab label='요청대기' value='1' />
						<Tab label='반려내역' value='2' />
						<Tab label='승인내역' value='3' />
						<Tab label='결제내역' value='4' />
						<Tab label='코인내역' value='5' />
						{/*<Tab label='정산대기' value='6' />*/}
						<Tab label='정산내역' value='6' />
						<Tab label='유저관리' value='7' />
						
					</TabList>
				</Box>
				<TabPanel value='1'>
					<AdminCodeRequestList type={PostStateType.pending} />
				</TabPanel>
				<TabPanel value='2'>
					<AdminCodeRequestList type={PostStateType.rejected} />
				</TabPanel>
				<TabPanel value='3'>
					<AdminCodeRequestList type={PostStateType.approve} />
				</TabPanel>
				<TabPanel value='4'>
					<AdminCashPointPage type={'cash'}/>
				</TabPanel>
				<TabPanel value='5'>
					<AdminCashPointPage type={'coin'}/>
				</TabPanel>
				{/*<TabPanel value='6'>*/}
				{/*	<AdminPaymentPendingPage isSettlement={false}/>*/}
				{/*</TabPanel>*/}
				<TabPanel value='6'>
					<AdminPaymentPendingPage isSettlement={true}/>
				</TabPanel>
				<TabPanel value='7'>
					<UserManageList />
				</TabPanel>
			</TabContext>
		</AdminLayout>
	);
};

export default AdminPage;