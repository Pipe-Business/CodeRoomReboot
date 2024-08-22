import { useCallback, useState } from 'react';

const useDialog = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const handleOpenDialog = useCallback(() => {
        setIsDialogOpen(true);

    }, []);
    const handleCloseDialog = useCallback(() => {
        setIsDialogOpen(false);

    }, []);
    return { isDialogOpen, handleOpenDialog, handleCloseDialog, setIsDialogOpen };
};

export default useDialog;