
import MainLayout from '../../layout/MainLayout.tsx';

function MainPage() {
    // xs -> sm -> md -> lg -> xl
    return (
        //todo 헤더 레이아웃 만들기
        <div>
            <MainLayout>
			{/* xs={24} sm={24} md={16} lg={16} xl={18}  */}
            {/*<CodeList type={'code'} data={data} />*/}
			{/*<LoginDialog isOpen={isLoginDialog} onClose={onCloseDialog} />*/}
		</MainLayout>
        
        </div>
       
    );
}
export default MainPage;