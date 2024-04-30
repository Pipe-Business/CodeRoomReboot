import React, {FC} from "react";
import Grid from "@mui/material/Unstable_Grid2";

interface Props {
    children?: React.ReactNode
}
// xs -> sm -> md -> lg -> xl
const BaseLayout: FC<Props> = ({children}) => {
    return (
        <Grid container columns={24}>
            <Grid xs={0} sm={0} md={0} lg={2} xl={4}/>
            <Grid xs={24} sm={24} md={24} lg={20} xl={16}>
                {children}
            </Grid>
            <Grid xs={0} sm={0} md={0} lg={2} xl={4}/>
        </Grid>
    );
};

export default BaseLayout;