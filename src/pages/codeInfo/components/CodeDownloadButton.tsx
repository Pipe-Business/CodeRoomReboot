import React, { FC, useCallback, useMemo } from 'react';
import { Button,  } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/ApiClient';

interface Props {
	children?: React.ReactNode;
	repoURL: string;
}


type GitHubForkModel = {
	userName: string,
	repoName: string,
	branchName: string
}


export const useMutateCodeDownload = () => {
	const { mutateAsync } = useMutation({
		mutationFn: async (data: GitHubForkModel) => {
			const result = await apiClient.getCodeDownloadURL(data.userName, data.repoName, data.branchName);
			return result.downloadURL;
		},
		onError:()=>{
			throw new Error("server error")
		}
	});
	return { getForkResultURL: mutateAsync };
};

const CodeDownloadButton: FC<Props> = ({ repoURL }) => {
	const handleURL = useMemo(() => {
		const split = repoURL.split('/');
		return [split[split.length - 2], split[split.length - 1]];

	}, [repoURL]);
	const { getForkResultURL } = useMutateCodeDownload();
	const onClickDownload = useCallback(async (e: any) => {
		try{
			e.stopPropagation();
			const url = await getForkResultURL({ userName: handleURL[0], repoName: handleURL[1], branchName: 'main' });
			window.location.href = url;
		}
		catch (e) {
			console.log(e);
		}
	}, [handleURL]);
	return (
		<Button onClick={onClickDownload} startIcon={<DownloadIcon />} sx={{ width: '100%', fontSize: '22px' }}
				variant='contained'>코드다운</Button>

	);
};

export default CodeDownloadButton;