import React, { FC } from 'react';
import FullLayout from '../../layout/FullLayout.tsx';
import { Divider,Box } from '@mui/material';

interface Props {
	children?: React.ReactNode;
}


const HelpPage: FC<Props> = () => {
	return (
		<FullLayout>
			<Box height={32} />

			<h1 style={{fontSize:'50px'}}>👨‍💻판매자 가이드👩‍💻</h1>

			<h3 style={{fontSize:'30px'}}>여러분이 정리한 코드를 직접 올려보세요!🚀</h3>
			<Box height={'32px'}/>

			<h3>코드룸의 심사 과정입니다.</h3>
			<img width={'1200px'} alt={'codeRoom Process'} src={'/codeRoom-Process.svg'}/>
			<h2 style={{fontSize:'30px'}}>1. 코드를 깃허브에 정리하기</h2>
			<ul>
				<li style={{fontSize:'20px'}}>여러분의 코드를 깃허브 레포지토리에 정리해보세요.</li>
				<li style={{fontSize:'20px'}}>코드에 대한 설명도 readme 에 적어보세요</li>
			</ul>
			<div style={{fontSize:'18px',marginBottom:'16px'}}>🚨 깃허브 레포지토리를 생성 할 때는 반드시 private 레포지토리로 생성 해야 됩니다. 🚨</div>
			<Divider/>
			<h2 style={{fontSize:'30px'}}>2. 관리자 초대하기</h2>
			<ul>
				<li style={{fontSize:'20px'}}>1번 과정이 완료되었다면 심사를 위해서 생성한 깃허브 레포지토리에 관리자를 초대 해야 합니다.</li>
			</ul>
			<details style={{marginTop:'12px'}}>
				<summary style={{fontSize:'20px',fontWeight:'bold',color:'#d27612'}}>깃허브에 관리자 초대</summary>
				<div>

					<ol style={{fontSize:'25px'}}>
						<li style={{margin:'8px'}}>생성된 레포지토리에 들어간후 <strong>Settings</strong>를 클릭합니다.</li>
						<img src='/githubInvite1.png' alt='githubInvite1.png' />
						<Box height={'32px'}/>
						<li style={{margin:'8px'}}>좌측에 있는 <strong>Collaborators</strong>를 클릭한 후 <strong>Add People</strong>를 클릭합니다.</li>
						<img src='/githubInvite2.png' alt='githubInvite2.png' />
						<Box height={'16px'}/>
						<li style={{margin:'8px'}}>관리자 닉네임을 입력하여 초대합니다. (관리자 닉네임 : <strong>uqlipt</strong>)</li>
						<img src='/githubInvite3.png' alt='githubInvite3.png' />
					</ol>
				</div>
			</details>
			<details style={{marginTop:'12px'}}>
				<summary style={{fontSize:'20px',fontWeight:'bold',color:'#d27612'}}>자주하는 질문</summary>
				<h3>Q: 왜 관리자를 초대해야 되나요?</h3>
				<p>A: CodeRoom은 게시 요청하신 코드를 내부적인 심사 과정을 걸쳐 최종적으로 코드룸에 게시됩니다. 심사 과정 중 관리자가 직접 깃허브를 검토하기 때문에 관리자를 초대해주셔야 합니다.</p>

			</details>
			<h2 style={{fontSize:'30px'}}>3. 코드 올리기</h2>
			<ul style={{fontSize:'20px'}}>
				<li>
					1. 카테고리 : 여러분의 올릴 코드의 분야를 선택해주세요 (프론트엔드,앱,백엔드 등)
				</li>
				<li>
					2. 개발언어 : 여러분이 올릴 코드의 개발 언어를 선택해주세요
				</li>
				<li>
					3. 코드제목 : 여러분의 올릴 코드의 제목을 적어주세요 .
				</li>
				<li>
					4. 코드설명 : 코드에 대한 자세한 설명입니다. 코드에서 사용되는 기술에대한 개념 설명, 왜 이러한 기술은 선택했는지등 자유롭게 적어주세요
				</li>
				<li>
					5. 구매자가이드 : 구매자가 코드를 다운받을때 참고사항으로 사용 에디터,사용된 언어의 버전, 사용된 라이브러리등 자유롭게 작성해주세요
				</li>
			</ul>




			{/*<h1>👨‍💻판매자 가이드👩‍💻</h1>*/}
			{/*<h3>여러분이 정리한 코드를 직접 올려보세요!</h3>*/}
			{/*<h3>1. 코드를 깃허브에 정리하기 </h3>*/}
			{/*<div>여러분의 코드를 깃허브 레포지토리에 정리해보세요. readme 문서에는 코드에 대한 전반적인 흐름이나 주요기능에 대한 설명을 자세하게 작성하면 좋습니다.</div>*/}
			{/*<h3>2.관리자 초대하기</h3>*/}
			{/*<div>여러분의 코드가 깃허브에 정리가 됐다면 관리자를 꼭 초대해야됩니다. 관리자 닉네임: uqlipt</div>*/}
			{/*<h4>Q: 왜 관리자를 초대해야되죠?</h4>*/}
			{/*<div>A: 코드룸은 관리자가 코드를 내부적인 심사를 통해 게시를 하기때문에 </div>*/}


			{/*<h3>3. 코드 올리기</h3>*/}
			{/*<div>여러분의 코드가 정리가 된 상태라면 메인 화면 좌측에 있는 "코드 올리기"를 클릭해주세요</div>*/}
			{/*<div>양식에 맞게 작성하고 요청하기를 누르면 관리자에게 여러분의 코드가 관리자에게 전송됩니다. </div>*/}
			{/*<h3>4. 관리자 코드 심사</h3>*/}
			{/*<div>여러분이 요청한 코드는 관리자가 내부적인 심사를 거쳐 승인 여부를 결정합니다.</div>*/}
			{/*<div>여러분의 코드가 반려됬더라도 걱정하지 마세요. 관리자에 피드백에 맞게 수정하면 다시 요청을 보내고 심사를 거쳐 승인될수 있습니다.</div>*/}
			{/*<h3>5. 🎉축하합니다! 여러분의 코드가 코드룸에 게시됐습니다. </h3>*/}
			<Box height={128} />
		</FullLayout>
	);
};

export default HelpPage;