import styled from "@emotion/styled"
import Button, { ButtonProps } from '@mui/material/Button';
import {MenuItem, MenuItemProps} from "@mui/material";

export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const FooterBox = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
`

interface MarginStyle {
    size:number
}
export const MarginHorizontal = styled.div<MarginStyle>`
  margin-left: ${(props) => props.size}px;
  margin-right: ${(props) => props.size}px;
`
export const MarginVertical = styled.div<MarginStyle>`
  margin-left: ${(props) => props.size};
  margin-right: ${(props) => props.size};
`
export const Margin = styled.div<MarginStyle>`
    margin: ${(props)=>props.size};
`

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: '#ffffff',
  backgroundColor: '#0275c2',
  height : '52px',
'&:hover': {
  backgroundColor: '#128ada',
  boxShadow: 'none',
  },
}));

export const TextButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: '#000000',
  backgroundColor: '#FFFFFF',
}));

export const MenuItemStyle = styled(MenuItem)<MenuItemProps>(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'transparent', // hover 배경색 제거
  },
  '&:focus': {
    backgroundColor: 'transparent', // focus 배경색 제거
  },
  '& .MuiListItemIcon-root': {
    minWidth: 36,
  },
}));