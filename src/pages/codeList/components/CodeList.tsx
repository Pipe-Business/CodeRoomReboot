import React, { FC } from 'react';
import { Button } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import CodeItem from './CodeItem';
import { MainPageCodeListEntity } from '../../../data/entity/MainPageCodeListEntity';

interface Props {
	children?: React.ReactNode,
	data?: MainPageCodeListEntity[],
	type?: 'code' | 'article'
}

const CodeList: FC<Props> = ({ type, data }) => { // 인자 타입 선언을 올바르게 수정
	const [searchParams] = useSearchParams();

	if (!data) {
		return null;
	}
	if (data.length === 0) {
		return <>
			<h1>{searchParams.get('type') === 'article' ? '게시글이' : '코드가'} 없어요 </h1>
			<h3>여러분이 만든 {searchParams.get('type') === 'article' ? '게시글을' : '소스코드를'} 게시해보아요 🚚🚚</h3>
			{searchParams.get('type') === 'code' ?
				<Link to={'/create/code'}>
					<Button>코드 게시하러가기</Button>
				</Link> :
				<Link to={'/create/article'}>
					<Button>게시글 작성하러가기</Button>
				</Link>
			}
		</>;
	}

	return (
		<div style={{ paddingTop: '8px', paddingBottom: '8px' }}>
			{data.map(item => {
				return (
					<div key={item.id}>
						<CodeItem key={item.id} item={item} />
					</div>
				);
			})}
		</div>
	);
};

export default CodeList;
