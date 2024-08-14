import {FormControl, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {SortOption} from "../../../api/ApiClient";
import React, {FC} from "react";

export const SortSelect: FC<{ onSortChange: (option: SortOption) => void, currentSort: SortOption }> = ({ onSortChange, currentSort }) => {
    const handleChange = (event: SelectChangeEvent) => {
        onSortChange(event.target.value as SortOption);
    };

    return (
        <FormControl sx={{ minWidth: 120, mb: 2 }}>
    <Select
        value={currentSort}
    onChange={handleChange}
    displayEmpty
    inputProps={{ 'aria-label': 'Without label' }}
>
    <MenuItem value="latest">최신순</MenuItem>
        <MenuItem value="oldest">오래된순</MenuItem>
        <MenuItem value="mostPurchased">구매 많은순</MenuItem>
    <MenuItem value="priceAsc">가격 낮은순</MenuItem>
    <MenuItem value="priceDesc">가격 높은순</MenuItem>
    </Select>
    </FormControl>
);
};