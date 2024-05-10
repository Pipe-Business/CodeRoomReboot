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

  interface BlurContainerStyle{
    isBlur:boolean
  }

  export const BlurContainer = styled.div<BlurContainerStyle>`
    filter:  ${(props) => props.isBlur == true ? ' blur(5px)' : 'none'};
  `;

