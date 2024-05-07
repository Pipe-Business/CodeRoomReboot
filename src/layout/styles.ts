import styled from '@emotion/styled'
import Button, { ButtonProps } from '@mui/material/Button';

export const HeaderWrapper = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 0;
	margin-bottom: 0;
	padding-top: 0;
	padding-bottom: 0;
	//background-color : #FFB6C1;
`

export const HeaderTitle = styled.div`
	margin-right: 18px;
	margin-left: 18px;
`
export const HeaderSearch = styled.div``
export const HeaderIconButton = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	& span {
		font-size: 12px;
	}
`
export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#000000',
    backgroundColor: '#FFFFFF',
	// '&:hover': {
	// 	backgroundColor: '#FFFFFF',
	// 	boxShadow: 'none',
	//   },
  }));

  export const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  margin-bottom: 16px;
  padding-top: 16px;
  padding-bottom: 0;
  //background-color : #FFB6C1;
`