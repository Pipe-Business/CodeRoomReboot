import MainLayout from '../../layout/MainLayout';
import {CenterBox, SearchBar} from './styles';
import {useQuery} from '@tanstack/react-query';
import {Box, IconButton, InputBase, Paper, Skeleton, Typography} from '@mui/material';
import useInput from '../../hooks/UseInput';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import {apiClient, SortOption} from '../../api/ApiClient';
import CodeList from '../codeList/components/CodeList';
import Paging from '../../components/paging/Paging';
import {MainPageCodeListEntity} from '../../data/entity/MainPageCodeListEntity';
import {SortSelect} from "./components/SortSelectComp";

const MainPage: FC = () => {
    const [sortOption, setSortOption] = useState<SortOption>('latest');
    const { isLoading, data, error } = useQuery({
        queryKey: ['codeStore', sortOption],
        queryFn: () => apiClient.getAllCode(sortOption),
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

    const handleSortChange = useCallback((newSortOption: SortOption) => {
        setSortOption(newSortOption);
        setCurrentPage(1); // Reset to first page when sort changes
    }, []);

    const [list, setList] = useState<MainPageCodeListEntity[]>([]);
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    //const [postPerPage] = useState(20); TODO 5개로 수정
    const [postPerPage] = useState(5);
    const [currentPosts, setCurrentPosts] = useState<MainPageCodeListEntity[]>([]);

    const getCurrentPosts = useCallback(() => {
        if (!data) return [];
        const indexOfLastPost = currentPage * postPerPage;
        const indexOfFirstPost = indexOfLastPost - postPerPage;
        return data.slice(indexOfFirstPost, indexOfLastPost);
    }, [data, currentPage, postPerPage]);

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
                <CenterBox>
                    <SearchBar>
                        <Paper
                            variant='outlined'
                            component='form'
                            onSubmit={onSubmitSearch}
                            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                        >
                            <InputBase
                                placeholder='찾으시는 코드 상품의 이름을 검색해주세요'
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

                <Box sx={{ px: 2, display: 'flex', justifyContent: 'flex-end', mt: 4, mr: 4, }}>
                    <SortSelect onSortChange={handleSortChange} currentSort={sortOption} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, width: { xs: '100%', md: '100%' }, mx: 'auto' }}>
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
                    <Skeleton variant="rectangular" sx={{ height: '100px', mb: 2, padding: { xs: '16px', sm: '24px', md: '24px' }, }} />
                </Box>
            </MainLayout>
        );
    }

    if (error) {
        return (
            <MainLayout>
                <Typography color="error">에러가 발생했습니다: {(error as Error).message}</Typography>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            {/*<CenterBox>*/}
            {/*    <Typography*/}
            {/*        variant="h4"*/}
            {/*        sx={{*/}
            {/*            fontWeight: 'bold',*/}
            {/*            color: '#000',*/}
            {/*            mt: 2,*/}
            {/*            mb: 3,*/}
            {/*            fontSize: { xs: '24px', sm: '30px', md: '36px' }*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        "개발자들을 위한 코드거래 플랫폼" CODE ROOM*/}
            {/*    </Typography>*/}
            {/*</CenterBox>*/}

            <CenterBox>
            <SearchBar>
                <Paper
                    variant='outlined'
                    component='form'
                    onSubmit={onSubmitSearch}
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                >
                    <InputBase
                        placeholder='찾으시는 코드 상품의 이름을 검색해주세요'
                        sx={{ flex: 1, px: 1, height: '54px', fontSize: '18px' }}
                        value={inputSearch}
                        onChange={onChangeInput}
                    />
                    <IconButton type='submit' sx={{ p: '8px' }}>
                        <SearchIcon fontSize="large" />
                    </IconButton>
                </Paper>
            </SearchBar>
            </CenterBox>

            <Box sx={{ px: 2, display: 'flex', justifyContent: 'flex-end', mt: 4, mr: 6, }}>
                <SortSelect onSortChange={handleSortChange} currentSort={sortOption} />
            </Box>
          
            <Box sx={{ px: 2 }}>
                <CodeList type='code' data={getCurrentPosts()} />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Paging page={currentPage} count={count} setPage={setPage} />
            </Box>
        </MainLayout>
    );
}

export default MainPage;
