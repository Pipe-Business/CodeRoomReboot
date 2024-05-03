
import MainLayout from '../../layout/MainLayout.tsx';
import {CenterBox, SearchBar} from './styles.ts';
import { useQuery } from '@tanstack/react-query';
import { Badge, IconButton, InputBase, Paper } from '@mui/material';
import useInput from '../../hooks/useInput.ts';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { MarginHorizontal, MarginVertical } from './styles.ts';
import Box from '@mui/material';
import { CodeEntity } from '../../data/CodeEntity.ts';
import { apiClient } from '../../api/ApiClient.ts';
import CodeList from '../codeList/components/CodeList.tsx';


function MainPage() {
    // xs -> sm -> md -> lg -> xl
    const { isLoading, data, error } = useQuery({
		queryKey: ['codeStore'],
		queryFn: () => apiClient.getAllCode(), 
			//supabaseGetAllWithQuery<CodeModel>(['codeStore'], orderByChild('createdAt')),

	});

    const [inputSearch, onChangeInput] = useInput('');
    const onSubmitSearch = useCallback((e: any) => {
		e.preventDefault();
		if (!inputSearch ) {
			alert('검색어를 입력해주세요');
			return;
		}
		navigate(`/code/search?query=${inputSearch}`);

	}, [inputSearch]);
    const navigate = useNavigate();
   


    return (
        
        <div>
            <MainLayout>
			{/* xs={24} sm={24} md={16} lg={16} xl={18}  */}
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
            
         
            <CodeList type={'code'} data={data} />
			{/*<LoginDialog isOpen={isLoginDialog} onClose={onCloseDialog} />*/}
            
		</MainLayout>
        
        </div>
       
    );
}
export default MainPage;