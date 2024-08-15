import {Box, FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {SortOption} from "../../../api/ApiClient";
import React, {FC} from "react";
import {StyledChip} from "./StyledChipComp";

export const SortSelect: FC<{ onSortChange: (option: SortOption) => void; currentSort: SortOption }> = ({
                                                                                                            onSortChange,
                                                                                                            currentSort,
                                                                                                        }) => {
    const sortOptions: { value: SortOption; label: string }[] = [
        {value: 'latest', label: '최신순'},
        {value: 'oldest', label: '오래된순'},
        {value: 'mostPurchased', label: '구매 많은순'},
        {value: 'priceAsc', label: '가격 낮은순'},
        {value: 'priceDesc', label: '가격 높은순'},
    ];

    return (
        <Box sx={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
            {sortOptions.map((option) => (
                <StyledChip
                    key={option.value}
                    label={option.label}
                    onClick={() => onSortChange(option.value)}
                    variant={currentSort === option.value ? 'filled' : 'outlined'}
                    clickable
                />
            ))}
        </Box>
    );
};