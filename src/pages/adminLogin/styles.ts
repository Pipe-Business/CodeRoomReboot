import styled from "@emotion/styled"
import Button, { ButtonProps } from '@mui/material/Button';

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
  backgroundColor: '#000000',
  height : '52px',
'&:hover': {
  backgroundColor: '#000000',
  boxShadow: 'none',
  },
}));

export const TextButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: '#000000',
  backgroundColor: '#FFFFFF',
// '&:hover': {
// 	backgroundColor: '#FFFFFF',
// 	boxShadow: 'none',
//   },
}));
