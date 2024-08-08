import styled from "@emotion/styled"
import Button from '@mui/material/Button';

export const ColorButton = styled(Button)(({ theme }) => ({
    display: 'inline-block',
    width: '10%',
    minWidth: '256px',
  }));

  export const NavigateButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: end;
  `