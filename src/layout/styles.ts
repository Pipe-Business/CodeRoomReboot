import styled from '@emotion/styled'
import Button, { ButtonProps } from '@mui/material/Button';

export const HeaderWrapper = styled.div<{ $isScrolled: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0;
    margin-bottom: 0;
    width: 100%;
    transition: all 0.3s ease-in-out;
    background-color: ${props => props.$isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 1)'};
    backdrop-filter: ${props => props.$isScrolled ? 'blur(10px)' : 'none'};
    box-shadow: ${props => props.$isScrolled ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};
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
    fontSize: '17px',
  }));

  export const FooterWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0;
  margin-bottom: 16px;
  padding-top: 16px;
  padding-bottom: 0;
`

export const CenterBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`