import {Box, Skeleton} from "@mui/material";
import React, {FC} from "react";

const ListLoadingSkeleton:FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, width: { xs: '100%', md: '100%' }, mx: 'auto' }}>
            <Skeleton variant="rectangular" sx={{ height: '24px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
            <Skeleton variant="rectangular" sx={{ height: '24px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
            <Skeleton variant="rectangular" sx={{ height: '24px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
            <Skeleton variant="rectangular" sx={{ height: '24px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
            <Skeleton variant="rectangular" sx={{ height: '24px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
        </Box>
    );
};

export default ListLoadingSkeleton;
