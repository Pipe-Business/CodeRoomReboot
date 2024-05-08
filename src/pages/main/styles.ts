import styled from '@emotion/styled'
import Button, { ButtonProps } from '@mui/material/Button';

export const SearchBar = styled.div`
    margin-top: 24px;
`

export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
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
  margin-top: ${(props) => props.size};
  margin-bottom: ${(props) => props.size};
`
export const Margin = styled.div<MarginStyle>`
    margin: ${(props)=>props.size};
`

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: '#000000',
  backgroundColor: '#50C1FF',
  height : '52px',
'&:hover': {
  backgroundColor: '#569CD6',
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
