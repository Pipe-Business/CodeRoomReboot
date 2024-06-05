import styled from "@emotion/styled"
import Button, { ButtonProps } from '@mui/material/Button';

export const FormWrapper = styled.form`
    & > div {
      margin-bottom: 16px;
      margin-left: 16px;
      margin-right: 16px;
    }
  `;

export  const TextFieldWrapper = styled.div`
    div {
      margin-bottom: 4px;
    }
  `;

  export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: 'white',
    backgroundColor: '#0156b3',
    height : '52px',
  '&:hover': {
    backgroundColor: '#569CD6',
    boxShadow: 'none',
    },
  }));