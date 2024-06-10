import React, {FC} from 'react';
import {Navigate} from 'react-router-dom';

interface Props {
	children?: React.ReactNode;
}

const CodePage: FC<Props> = () => {
	// const { isLoading } = useQuery({
	// 	queryKey: ['codeStore'],
	// 	queryFn: () => firebaseGetAllWithQuery<CodeEntity>(['codeStore'], orderByChild('createdAt')),
	// });


	if (false) {
		return <>loading</>;
	}

	return (
		<Navigate to={'/'} />
		// <MainLayout>
		// 	{data && <CodeList data={data} />}
		// </MainLayout>
	);
};

export default CodePage;