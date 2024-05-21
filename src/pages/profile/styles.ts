import styled from "@emotion/styled"
import Button, { ButtonProps } from '@mui/material/Button';

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#000000',
    backgroundColor: '#50C1FF',
    height : '52px',
  '&:hover': {
    backgroundColor: '#569CD6',
    boxShadow: 'none',
    },
  }));

  export const CashColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#000000',
    backgroundColor: '#50C1FF',
    height : '52px',
  '&:hover': {
    backgroundColor: '#569CD6',
    boxShadow: 'none',
    },
  }));


  export const SectionWrapper = styled.div`
  display : flex;
  width : 100%;
  flex-direction: column;
  background-color : #F4F5F8;
  padding-left : 16px;
  padding-right : 16px;
  padding-top : 32px;
  padding-bottom : 32px;
  margin-right : 32px;
  `