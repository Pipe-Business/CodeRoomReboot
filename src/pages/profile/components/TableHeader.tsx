import React, {FC} from "react";
import {TableHead, TableRow} from "@mui/material";
import {TableHeaderTitle} from "../styles";

interface HeaderProps {
    headerList: string[];
}

const  TableHeader: FC<HeaderProps> = ({headerList})=>{
    return (
        <TableHead >
            <TableRow>
                {headerList.map((title, i)=> (
                    <TableHeaderTitle key={i}>{title}</TableHeaderTitle>
                ))}
            </TableRow>
        </TableHead>
    );
}
export default TableHeader;