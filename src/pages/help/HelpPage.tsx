import React, { FC } from 'react';
import FullLayout from '../../layout/FullLayout';
import { Divider, Box, Button, Typography, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';
import { toast } from "react-toastify";

interface Props {
	children?: React.ReactNode;
}

const templateText = `# 프로젝트 이름

![프로젝트 사진](이미지_링크)

## 프로젝트 설명
프로젝트에 대한 간단한 설명을 여기에 작성합니다. 프로젝트의 목적, 주요 기능, 대상 사용자 등에 대해 설명하세요.

## 프로젝트 개발 참여자
- **이름1** - 역할 및 기여 부분
- **이름2** - 역할 및 기여 부분
- **이름3** - 역할 및 기여 부분

## 주요 사용 기술 스택 및 버전
- **언어**: 예) Python 3.8, JavaScript ES6
- **프레임워크**: 예) Django 3.1, React 17
- **데이터베이스**: 예) PostgreSQL 13
- **기타 라이브러리 및 툴**: 예) Docker, Redis

## 개발 완료 일시
개발이 완료된 날짜를 여기에 작성하세요. 예) 2024년 6월 18일

## 개발 환경
개발 환경에 대한 설명을 작성합니다. 예를 들어 운영체제, 필요한 소프트웨어 버전 등을 기재하세요.
- **운영체제**: 예) Ubuntu 20.04
- **필요 소프트웨어**: 예) Node.js 14, Python 3.8

## 설치 및 실행 방법
프로젝트를 설치하고 실행하는 방법에 대한 안내를 작성합니다. 단계별로 명확하게 설명하세요.

### 설치 방법
1. 저장소를 클론합니다.
    \`\`\`sh
    git clone https://github.com/username/repository.git
    cd repository
    \`\`\`
2. 필요한 패키지를 설치합니다.
    \`\`\`sh
    # 예: Python 프로젝트의 경우
    pip install -r requirements.txt
    
    # 예: JavaScript 프로젝트의 경우
    npm install
    \`\`\`

### 실행 방법
1. 데이터베이스를 설정합니다.
    \`\`\`sh
    # 예: 데이터베이스 마이그레이션
    python manage.py migrate
    \`\`\`

2. 서버를 시작합니다.
    \`\`\`sh
    # 예: Python Django 프로젝트의 경우
    python manage.py runserver
    
    # 예: Node.js 프로젝트의 경우
    npm start
    \`\`\`

3. 웹 브라우저에서 \`http://localhost:8000\` (또는 해당 포트)으로 접속하여 프로젝트를 확인합니다.

---
`;

const copyToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(templateText);
		toast.success('성공적으로 템플릿 텍스트가 복사되었습니다');
	} catch (err) {
		toast.error('클립보드에 복사하는데 실패했습니다');
	}
};

const HelpPage: FC<Props> = () => {
	return (
		//Todo 판매자 가이드 수정 필요
		<FullLayout>
			<Box py={4}>
				<Card variant="outlined" sx={{ mb: 4 }}>
					<CardContent>
						<Typography variant="h4" component="h4" gutterBottom fontWeight={"bold"}>
							👨‍💻코드룸 판매자 가이드👩‍💻
						</Typography>

						<Typography variant="h5" component="h5" gutterBottom>
							판매자님이 정리한 코드 템플릿을 '코드룸'에 직접 올려보세요!🚀
						</Typography>
					</CardContent>
				</Card>

				<Card variant="outlined" sx={{ mb: 4 }}>
					<CardContent>
						<Typography variant="h5" component="h5" gutterBottom fontWeight={"bold"}>
							판매자님의 코드에 대한 심사 과정은 다음과 같습니다
						</Typography>
						<Box height={8}/>
						<img width={'60%'} alt={'codeRoom Process'}
										src={'/codeRoom-Process.svg'} style={{ border: '2px solid #000', borderRadius: '4px', padding:'16px'}}/>
					</CardContent>
				</Card>

				<Card variant="outlined" sx={{mb: 4 }}>
					<CardContent>
						<Typography variant="h5" component="h5" gutterBottom fontWeight={"bold"}>
							1. 코드를 깃허브에 정리하기
						</Typography>
						<List>
							<ListItem>
								<ListItemText
									primary="판매자님의 코드를 깃허브 레포지토리에 템플릿 코드의 형태로 정리해보세요"
									primaryTypographyProps={{ fontSize: 20 }}
								/>
							</ListItem>
							<ListItem>
								<Button onClick={copyToClipboard} style={{ textTransform: 'none', fontSize: '20px' }}>
									제시된 코드룸 ReadMe 공식 템플릿
								</Button>
								<ListItemText
									primary="에 맞춰서 코드에 대한 설명을 작성해주세요"
									primaryTypographyProps={{ fontSize: 20 }}
								/>
							</ListItem>
						</List>
						<Typography variant="body1" style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 'bold' }}>
							🚨 깃허브 레포지토리를 생성 할 때, 반드시 private repository로 생성 해주셔야 합니다 🚨
						</Typography>
					</CardContent>
				</Card>

				<Divider />

				<Card variant="outlined" sx={{ mb: 4 }}>
					<CardContent>
						<Typography variant="h5" component="h5" gutterBottom fontWeight={"bold"}>
							2. 관리자 초대하기
						</Typography>
						<List>
							<ListItem>
								<ListItemText
									primary="1번 과정이 완료되었다면 심사를 위해서 생성한 깃허브 레포지토리에 관리자를 초대 해야 합니다."
									primaryTypographyProps={{ fontSize: 20 }}
								/>
							</ListItem>
						</List>

						<details style={{ marginTop: '12px' }}>
							<summary style={{ fontSize: '20px', fontWeight: 'bold', color: '#d27612' }}>
								깃허브에 관리자 초대
							</summary>
							<Box pt={2} pl={2}>
								<ol style={{ fontSize: '20px', marginLeft: '16px' }}>
									<li style={{ margin: '8px' }}>생성된 레포지토리에 들어간후 <strong>Settings</strong>를 클릭합니다.</li>
									<img src='/githubInvite1.png' alt='githubInvite1.png' width="70%" style={{ border: '2px solid #000', borderRadius: '4px' }}/>
									<Box height={'32px'} />
									<li style={{ margin: '8px' }}>좌측에 있는 <strong>Collaborators</strong>를 클릭한 후 <strong>Add People</strong>를 클릭합니다.</li>
									<img src='/githubInvite2.png' alt='githubInvite2.png' width="70%" style={{ border: '2px solid #000', borderRadius: '4px' }}/>
									<Box height={'32px'} />
									<li style={{ margin: '8px' }}>관리자 닉네임을 입력하여 초대합니다. (관리자 닉네임 : <strong>team-code-room</strong>)</li>
									<img src='/githubInvite3.png' alt='githubInvite3.png' width="70%" style={{ border: '2px solid #000', borderRadius: '4px' }}/>
								</ol>
							</Box>
						</details>

						<details style={{ marginTop: '12px' }}>
							<summary style={{ fontSize: '20px', fontWeight: 'bold', color: '#d27612' }}>
								자주하는 질문
							</summary>
							<Box pt={2} pl={2}>
								<Typography variant="h6" gutterBottom fontWeight={"bold"}>Q: 왜 관리자를 초대해야 되나요?</Typography>
								<Typography variant="body1">A: CodeRoom은 게시 요청하신 코드를 내부적인 심사 과정을 걸쳐 최종적으로 코드룸에 게시됩니다. 심사 과정 중 관리자가 직접 깃허브를 검토하기 때문에 관리자를 초대해주셔야 합니다.</Typography>
							</Box>
						</details>
					</CardContent>
				</Card>

				<Card variant="outlined" sx={{ mb: 4 }}>
					<CardContent>
						<Typography variant="h5" component="h5" gutterBottom fontWeight={"bold"}>
							3. 코드 올리기
						</Typography>
						<List>
							<ListItem>
								<ListItemText primary="1. 카테고리 : 판매자님의 올릴 코드의 분야를 선택해주세요 (프론트엔드,앱,백엔드 등)" primaryTypographyProps={{ fontSize: 20 }} />
							</ListItem>
							<ListItem>
								<ListItemText primary="2. 개발언어 : 판매자님 올릴 코드의 개발 언어를 선택해주세요" primaryTypographyProps={{ fontSize: 20 }} />
							</ListItem>
							<ListItem>
								<ListItemText primary="3. 코드제목 : 판매자님 올릴 코드의 제목을 적어주세요." primaryTypographyProps={{ fontSize: 20 }} />
							</ListItem>
							<ListItem>
								<ListItemText primary="4. 코드설명 : 코드에 대한 자세한 설명입니다. 코드에서 사용되는 기술에대한 개념 설명, 왜 이러한 기술은 선택했는지등 자유롭게 적어주세요" primaryTypographyProps={{ fontSize: 20 }} />
							</ListItem>
							<ListItem>
								<ListItemText primary="5. 구매자가이드 : 구매자가 코드를 다운받을때 참고사항으로 사용 에디터, 사용된 언어의 버전, 사용된 라이브러리등 자유롭게 작성해주세요" primaryTypographyProps={{ fontSize: 20 }} />
							</ListItem>
						</List>
					</CardContent>
				</Card>

				<Box height={128} />
			</Box>
		</FullLayout>
	);
};

export default HelpPage;
