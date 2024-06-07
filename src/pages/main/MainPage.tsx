import MainLayout from '../../layout/MainLayout.tsx';
import { CenterBox, SearchBar } from './styles.ts';
import { useQuery } from '@tanstack/react-query';
import { Badge, IconButton, InputBase, Paper, Box, Skeleton, Typography } from '@mui/material';
import useInput from '../../hooks/useInput.ts';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { MarginHorizontal } from './styles.ts';
import { CodeModel } from '../../data/model/CodeModel.ts';
import { apiClient } from '../../api/ApiClient.ts';
import CodeList from '../codeList/components/CodeList.tsx';
import Paging from '../../components/paging/Paging.tsx';
import { MainPageCodeListEntity } from '../../data/entity/MainPageCodeListEntity.ts';

const MainPage: FC = () => {
    const { isLoading, data, error } = useQuery({
        queryKey: ['codeStore'],
        queryFn: () => apiClient.getAllCode(),
    });

    const [inputSearch, onChangeInput] = useInput('');
    const navigate = useNavigate();

    const onSubmitSearch = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!inputSearch) {
            alert('검색어를 입력해주세요');
            return;
        }
        navigate(`/code/search?query=${inputSearch}`);
    }, [inputSearch, navigate]);

    const [list, setList] = useState<MainPageCodeListEntity[]>([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [postPerPage] = useState(20);
    const [currentPosts, setCurrentPosts] = useState<MainPageCodeListEntity[]>([]);

    const setPage = useCallback(
        (page: number) => {
            setCurrentPage(page);
        }, []
    );

    useEffect(() => {
        if (data) {
            setList(data);
        }
    }, [data]);

    useEffect(() => {
        if (list.length) {
            setCount(list.length);
            const indexOfLastPost = currentPage * postPerPage;
            const indexOfFirstPost = indexOfLastPost - postPerPage;
            setCurrentPosts(list.slice(indexOfFirstPost, indexOfLastPost));
        }
    }, [currentPage, list, postPerPage]);

    if (isLoading) {
        return (
            <MainLayout>
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, width: { xs: '100%', md: '850px' }, mx: 'auto' }}>
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2 }} />
                </Box>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <CenterBox sx={{ flexDirection: 'column', textAlign: 'center', p: 2 }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: '#000',
                        mt: 2,
                        mb: 3,
                        fontSize: { xs: '24px', sm: '30px', md: '36px' }
                    }}
                >
                    "코드룸은 개발자들을 위한 코드거래 플랫폼입니다"
                </Typography>
            </CenterBox>
            <CenterBox>
            <SearchBar sx={{ width: { xs: '90%', sm: '60%', md: '600px' }, mx: 'auto', mb: 4 }}>
                <Paper
                    variant='outlined'
                    component='form'
                    onSubmit={onSubmitSearch}
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                >
                    <InputBase
                        placeholder='찾으시는 상품의 이름을 검색해주세요'                        
                        sx={{ flex: 1, px: 1, height: '50px' }}
                        value={inputSearch}
                        onChange={onChangeInput}
                    />
                    <IconButton type='submit' sx={{ p: '8px' }}>
                        <SearchIcon fontSize="small" />
                    </IconButton>
                </Paper>
            </SearchBar>
            </CenterBox>
          
            <Box sx={{ px: 2 }}>
                <CodeList type='code' data={currentPosts} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Paging page={currentPage} count={count} setPage={setPage} />
            </Box>
        </MainLayout>
    );
}

export default MainPage;
