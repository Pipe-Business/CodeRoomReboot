import styled from "@emotion/styled"
import Button, {ButtonProps} from '@mui/material/Button';
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import {TableCell} from "@mui/material";

export const MyPageTabPageBtn = styled(Button)<ButtonProps>(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: '#0275c2',
  height : '52px',
  '&:hover': {
    backgroundColor: '#128ada',
    boxShadow: 'none',
  },
}));

export const StyledTabList = styled(TabList)({
  width: '100%',
  display: 'flex',
  borderBottom: 'none',
  '& .MuiTabs-indicator': {
    height: '3px',
    backgroundColor: '#000', // 활성 탭 하단 바 색상
  },
});

export const StyledTab = styled(Tab)({
  flex: 1,
  width: '100%',
  textTransform: 'none',
  fontWeight: 'bold',
  fontSize: '16px',
  padding: '12px 16px',
  color: '#888', // 비활성 탭 글자 색상
  '&.Mui-selected': {
    color: '#000', // 활성 탭 글자 색상
  },
  '&:hover': {
    color: '#555', // 호버 상태 탭 글자 색상
  },
});

  export const SectionWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    background-color: #F4F5F8;
    padding: 32px 16px;
    margin-right: 32px;
  `;

export const FormWrapper = styled.form`
    & > div {
      margin-bottom: 16px;
      margin-left: 16px;
      margin-right: 16px;
    }
  `;

export const TableHeaderTitle = styled(TableCell)`
  font-weight: bold;
  font-size: 16px;
`;

export const TotalAmountTitleText = styled.div`
  font-weight: bold;
  font-size: 32px;
  margin : 16px 8px;
`;

export const ListEmptyTextStyle = styled.div`
    display: flex;
    margin: 64px;
    justify-content: center;
    font-size: 16px;
    fontweight: bold;
    color: gray;
`;