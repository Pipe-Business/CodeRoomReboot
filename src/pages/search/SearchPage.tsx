import React, { FC, useCallback } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { REACT_QUERY_KEY } from '../../constants/define';
import { apiClient } from '../../api/ApiClient';
import { CodeModel } from '../../data/model/CodeModel';
import { CircularProgress } from '@mui/material';
import MainLayout from '../../layout/MainLayout';
import {Button, IconButton} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import CodeList from '../codeList/components/CodeList';



interface Props {
	children?: React.ReactNode;
}

const SearchPage: FC<Props> = () => {
	const [searchParams] = useSearchParams();
	const paramQuery = searchParams.get('query');
    const navigate = useNavigate();
    const onClickPreviousButton = useCallback(()=>{
        navigate('/')
    },[])

    const {isLoading: isLoadingCodeSearch, data: codeSearchData} = useQuery({
        queryKey: [REACT_QUERY_KEY.code, "query", paramQuery],
        queryFn: async () => {
            const data = await apiClient.getQueryCode(paramQuery!);
            const newList: CodeModel[] = [];
            if (!data) return null
            data.map(item => {
                if (item.title.includes(paramQuery!)) {
                    newList.push(item)
                }
            })
            return newList
        }
    })

    if (!paramQuery) {
		return <>검색어가 없어요</>;
	}
	if (isLoadingCodeSearch) {
		return <CircularProgress />;
	}
    if (!codeSearchData) {
		return <MainLayout>
			<h3>{paramQuery} 의 검색결과</h3>
			존재하지않아요<br />
			<Link to={'/'}>
				<Button variant={'outlined'}>
					홈으로가기
				</Button>
			</Link>
		</MainLayout>;

	}


    return (
    <MainLayout>
			<div style={{ display: 'flex', alignItems: 'center', width:'850px'}}>
                <IconButton onClick={onClickPreviousButton}>
                    <ArrowBack/>
                </IconButton>
				<h3>{paramQuery} 의 검색결과</h3>
			</div>
			{codeSearchData.length === 0 ?
				<>해당검색어에대한 결과가 없습니다.</> :
				<CodeList data={codeSearchData} />
			}
		</MainLayout>
    );

};
export default SearchPage;