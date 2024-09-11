import styled from '@emotion/styled'
import Button, { ButtonProps } from '@mui/material/Button';
import {Link} from "react-router-dom";

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

export const HeaderTitle = styled(Link)`
    text-decoration: none;
    transition: all 0.3s ease;

    h2 {
        font-size: 36px;
        margin-top: 20px;
        margin-bottom: 20px;
        font-weight: bold;
    }

    span {
        font-family: 'sans-serif';
        transition: all 0.3s ease;
        color: #000000; // 모든 span의 기본 색상을 검은색으로 설정
    }

    &:hover {
        span:first-of-type, span:last-of-type {
            color: #4a90e2; // 괄호 색상 변경
        }
        span:nth-of-type(2) {
            color: #2c3e50; // CODE ROOM 텍스트 색상 변경
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
    }
`;
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