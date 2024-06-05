
import MainLayout from '../../layout/MainLayout.tsx';
import { CenterBox, SearchBar } from './styles.ts';
import { useQuery } from '@tanstack/react-query';
import { Badge, IconButton, InputBase, Paper } from '@mui/material';
import useInput from '../../hooks/useInput.ts';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { MarginHorizontal, MarginVertical } from './styles.ts';
import Box from '@mui/material';
import { CodeModel } from '../../data/model/CodeModel.ts';
import { apiClient } from '../../api/ApiClient.ts';
import CodeList from '../codeList/components/CodeList.tsx';
import Paging from '../../components/paging/Paging.tsx';
import { Skeleton } from '@mui/material';
import { supabase } from '../../api/ApiClient.ts';
import { User } from '@supabase/supabase-js';
import FullLayout from '../../layout/FullLayout.tsx';
import { MainPageCodeListEntity } from '../../data/entity/MainPageCodeListEntity.ts';

function MainPage() {
    // xs -> sm -> md -> lg -> xl
    const { isLoading, data, error } = useQuery({
        queryKey: ['codeStore'],
        queryFn: () => apiClient.getAllCode(),

    });

    const [inputSearch, onChangeInput] = useInput('');
    const onSubmitSearch = useCallback((e: any) => {
        e.preventDefault();
        if (!inputSearch) {
            alert('검색어를 입력해주세요');
            return;
        }
        navigate(`/code/search?query=${inputSearch}`);

    }, [inputSearch]);
    const navigate = useNavigate();

    const [list, setList] = useState<MainPageCodeListEntity[]>([]);
    const [count, setCount] = useState(0); // 아이템 총 개수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지. default 값으로 1
    const [postPerPage] = useState(20); // 한 페이지에 보여질 아이템 수 
    const [indexOfLastPost, setIndexOfLastPost] = useState(0); // 현재 페이지의 마지막 아이템 인덱스
    const [indexOfFirstPost, setIndexOfFirstPost] = useState(0); // 현재 페이지의 첫번째 아이템 인덱스
    const [currentPosts, setCurrentPosts] = useState<MainPageCodeListEntity[]>([]); // 현재 페이지에서 보여지는 아이템들

    const setPage = useCallback(
        (page: any) => {
            console.log("page" + page);
            setCurrentPage(page);
        }, [currentPage, indexOfLastPost, indexOfFirstPost, list, postPerPage]
    );

    useEffect(() => { // data set
        if (data) {
            setList(data);
        }
    }, [data]);


    useEffect(() => {
        if (data) {
            setCount(list.length); // item 개수 set
            setIndexOfLastPost(currentPage * postPerPage);
            setIndexOfFirstPost(indexOfLastPost - postPerPage);
            setCurrentPosts(list.slice(indexOfFirstPost, indexOfLastPost));
        }
    }, [currentPage, indexOfLastPost, indexOfFirstPost, list, postPerPage]);

    if (isLoading) {
        return (
            <MainLayout>
                <div style={{ display: 'flex', width: '850px', flexDirection: 'column', marginTop: '32px' }}>
                    <Skeleton style={{ height: '100px' }} />
                    <Skeleton style={{ height: '100px' }} />
                    <Skeleton />
                    <Skeleton style={{ height: '100px' }} />
                    <Skeleton />
                </div>
            </MainLayout>
        );
    }


    return (

        <div>
            <MainLayout>
                {/* xs={24} sm={24} md={16} lg={16} xl={18}  */}
                <CenterBox>
                    <MarginHorizontal size={8} style={{ marginTop: 24, marginBottom: 24, }}>
                        <span style={{ color: '#000000', fontSize: '30px', fontWeight: 'bold' }}>"코드룸은 개발자들을 위한 코드거래 플랫폼입니다"</span>
                    </MarginHorizontal>
                </CenterBox>

                <SearchBar>
                    <Paper
                        variant='outlined'
                        className='search-textfield'
                        component='form'
                        onSubmit={onSubmitSearch}
                        sx={{ p: '2px 12px', display: 'flex', alignItems: 'center' }}
                    >
                        <InputBase
                            placeholder='찾으시는 상품의 이름을 검색해주세요'
                            style={{ width: '850px' }}
                            value={inputSearch}
                            onChange={onChangeInput}
                        />
                        <IconButton type='submit' sx={{ p: '10px' }} aria-label='search'>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </SearchBar>


                <CodeList type={'code'} data={currentPosts} />
                <Paging page={currentPage} count={count} setPage={setPage} />

            </MainLayout>

        </div>

    );
}
export default MainPage;