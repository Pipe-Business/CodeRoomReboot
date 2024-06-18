import styled from "@emotion/styled"
import Button, { ButtonProps } from '@mui/material/Button';

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#ffffff',
    backgroundColor: '#0275c2',
    height : '52px',
    '&:hover': {
        backgroundColor: '#128ada',
        boxShadow: 'none',
    },
}));

export const FormWrapper = styled.form`
    & > div {
      margin-bottom: 16px;
      margin-left: 16px;
      margin-right: 16px;
    }
  `;

export  const TextFieldWrapper = styled.div`
    div {
      margin-bottom: 8px;
    }
  `;