import styled from "@emotion/styled";
import Button, {ButtonProps} from "@mui/material/Button";

export const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    color: '#ffffff',
    backgroundColor: 'primary',
    height : '52px',
    '&:hover': {
        backgroundColor: '#569CD6',
        boxShadow: 'none',
    },
}));
