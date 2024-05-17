import React, { FC, useEffect } from 'react';
import AdminLayout from '../../layout/AdminLayout.tsx';
import { Box } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
//import AdminPaymentPendingPage from './AdminPaymentPendingPage.tsx';
// import UserManageList from './components/userList/UserManageList.tsx';
// import AdminCodeRequestList from './components/codeRequest/AdminCodeRequestList.tsx';
import { useLocation, useSearchParams } from 'react-router-dom';
//import AdminBootpayPaymentPage from './AdminBootpayPaymentPage.tsx';
import AdminCodeRequestList from './components/codeRequest/AdminCodeRequestList.tsx';

interface Props {
	children?: React.ReactNode;
}

const AdminPage: FC<Props> = () => {
	const [value, setValue] = React.useState('1');
	const location = useLocation();
	const tab = location.state?.tab;
	const [searchParams, setSearchParams] = useSearchParams();
	useEffect(() => {
		setValue(searchParams.get('tab') ?? '1');
	}, []);

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
						<Tab label='정산대기' value='4' />
						<Tab label='정산내역' value='5' />
						<Tab label='결제관리' value='6' />
						<Tab label='유저관리' value='7' />
					</TabList>
				</Box>
				<TabPanel value='1'>
					<AdminCodeRequestList type={'pending'} />
				</TabPanel>
				<TabPanel value='2'>
					<AdminCodeRequestList type={'reject'} />
				</TabPanel>
				<TabPanel value='3'>
					<AdminCodeRequestList type={'approve'} />
				</TabPanel>
				<TabPanel value='4'>
					<AdminCodeRequestList type={'approve'} />
				</TabPanel>
				<TabPanel value='5'>
					<AdminCodeRequestList type={'approve'} />
				</TabPanel>
				{/* <TabPanel value='4'>
					<AdminPaymentPendingPage isSettlement={false} />
				</TabPanel> */}
				{/* <TabPanel value='5'>
					<AdminPaymentPendingPage isSettlement={true} />
				</TabPanel> */}
				<TabPanel value='6'>
					<AdminCodeRequestList type={'approve'} />
				</TabPanel>
				<TabPanel value='7'>
					<AdminCodeRequestList type={'approve'} />
				</TabPanel>
				{/* <TabPanel value='6'>
					<AdminBootpayPaymentPage />
				</TabPanel>
				<TabPanel value='7'>
					<UserManageList />
				</TabPanel> */}
			</TabContext>
		</AdminLayout>
	);
};

export default AdminPage;