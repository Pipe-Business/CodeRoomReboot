import React, { FC } from 'react';
import Pagination from "react-js-pagination";
import "./Paging.css";

interface Props {
  children?: React.ReactNode;
  page: number;
  count: number;
  setPage: (page: any) => void;
}

export const Paging: FC<Props> = ({ page, count, setPage }) => {
  return (
    <div>
      <Pagination
        activePage={page}
        //itemsCountPerPage={20}
          itemsCountPerPage={5}
        totalItemsCount={count}
        pageRangeDisplayed={5}
        prevPageText={"< Prev"}
        nextPageText={"Next >"}
        firstPageText={"First"}
        lastPageText={"Last"}
        onChange={setPage}
      />
    </div>
  );
};

export default Paging;