import {styled} from "@mui/material/styles";
import {Chip} from "@mui/material";

export const StyledChip = styled(Chip)(({ theme }) => ({
    margin: theme.spacing(0.5),
    '&.MuiChip-outlined': {
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
    },
    '&.MuiChip-filled': {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
    },
}));