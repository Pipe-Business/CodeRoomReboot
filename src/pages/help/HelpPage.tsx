import React, {FC} from 'react';
import FullLayout from '../../layout/FullLayout';
import {Box, Card, CardContent, Divider, List, ListItem, ListItemText, Typography} from '@mui/material';
import Button from "@mui/material/Button";
import {useNavigate} from "react-router-dom";

interface Props {
    children?: React.ReactNode;
}

const HelpPage: FC<Props> = () => {
    const navigate = useNavigate();
    return (
        <FullLayout>
            <Box py={4}>
                <Card variant="outlined" sx={{mb: 4}}>
                    <CardContent>
                        <Typography variant="h4" component="h4" gutterBottom fontWeight={"bold"}>
                            👨‍💻코드룸 판매자 가이드👩‍💻
                        </Typography>

                        <Typography variant="h5" component="h5" gutterBottom>
                            판매자님이 정리한 코드 템플릿을 '코드룸'에 직접 올려보세요!🚀
                        </Typography>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{mb: 4}}>
                    <CardContent>
                        <Typography variant="h5" component="h5" gutterBottom fontWeight={"bold"}>
                            1. 코드를 깃허브에 정리하기
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="판매자님의 코드를 깃허브 레포지토리에 템플릿 코드의 형태로 정리해보세요"
                                    primaryTypographyProps={{fontSize: 20}}
                                />
                            </ListItem>
                            <details style={{marginTop: '12px'}}>
                                <summary style={{fontSize: '20px', fontWeight: 'bold', color: '#d27612'}}>
                                    Github가 처음이라면?
                                </summary>
                                <ListItem>
                                    <ListItemText
                                        primary="Github는 개발자들이 소스코드를 관리하고 협업 할 수 있도록 돕는 웹 기반 플랫폼입니다.
                                    코드룸은 Git이라는 버전 관리 시스템과 Github를 이용하여 코드를 저장하고 관리합니다.
                                    "
                                    />
                                </ListItem>
                                <ListItem>
                                    (1)
                                    <Button onClick={() => {
                                        window.open('https://github.com')
                                    }}>Github 홈페이지</Button>
                                    <ListItemText primary="로 이동합니다."/>
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="(2) 회원가입이 안되어있다면 Sign up 버튼을 클릭하여 회원가입을 절차에 따라 완료합니다."
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="(3) Github 홈페이지에 Sign in 버튼을 클릭하여 로그인합니다."
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="(4) New Repository를 클릭하여 레포지토리를 생성하고 private으로 설정해주세요. "
                                    />
                                </ListItem>
                            </details>
                            <Box height={'24px'}/>
                        </List>
                        <Typography variant="body1"
                                    style={{fontSize: '18px', marginBottom: '16px', fontWeight: 'bold'}}>
                        🚨 깃허브 레포지토리를 생성 할 때, 반드시 private repository로 생성 해주셔야 합니다 🚨
                        </Typography>
                    </CardContent>
                </Card>

                <Divider/>

                <Card variant="outlined" sx={{mb: 4}}>
                    <CardContent>
                        <Typography variant="h5" component="h5" gutterBottom fontWeight={"bold"}>
                            2. 관리자 초대하기
                        </Typography>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary="1번 과정이 완료되었다면 심사를 위해서 생성한 깃허브 레포지토리에 관리자를 초대 해야 합니다."
                                    primaryTypographyProps={{fontSize: 20}}
                                />
                            </ListItem>
                        </List>

                        <details style={{marginTop: '12px'}}>
                            <summary style={{fontSize: '20px', fontWeight: 'bold', color: '#d27612'}}>
                                깃허브에 관리자 초대
                            </summary>
                            <Box pt={2} pl={2}>
                                <ol style={{fontSize: '20px', marginLeft: '16px'}}>
                                    <li style={{margin: '8px'}}>생성된 레포지토리에 들어간후 <strong>Settings</strong>를 클릭합니다.</li>
                                    <img src='/githubInvite1.png' alt='githubInvite1.png' width="70%"
                                         style={{border: '2px solid #000', borderRadius: '4px'}}/>
                                    <Box height={'32px'}/>
                                    <li style={{margin: '8px'}}>좌측에 있는 <strong>Collaborators</strong>를 클릭한 후 <strong>Add
                                        People</strong>를 클릭합니다.
                                    </li>
                                    <img src='/githubInvite2.png' alt='githubInvite2.png' width="70%"
                                         style={{border: '2px solid #000', borderRadius: '4px'}}/>
                                    <Box height={'32px'}/>
                                    <li style={{margin: '8px'}}>관리자 닉네임을 입력하여 초대합니다. (관리자 닉네임
                                        : <strong>team-code-room</strong>)
                                    </li>
                                    <img src='/githubInvite3.png' alt='githubInvite3.png' width="70%"
                                         style={{border: '2px solid #000', borderRadius: '4px'}}/>
                                </ol>
                            </Box>
                        </details>

                        <Box height={'32px'}/>
                        <summary style={{fontSize: '20px', fontWeight: 'bold', color: '#d27612'}}>
                            자주하는 질문
                        </summary>
                        <Box pt={2} pl={2}>
                            <Typography variant="h6" gutterBottom fontWeight={"bold"}>Q: 왜 관리자를 초대해야
                                되나요?</Typography>
                            <Typography variant="body1">A: CodeRoom은 게시 요청하신 코드를 내부적인 심사 과정을 걸쳐 최종적으로 코드룸에 게시됩니다. 심사
                                과정 중 관리자가 직접 깃허브를 검토하기 때문에 관리자를 초대해주셔야 합니다.</Typography>
                        </Box>
                    </CardContent>
                </Card>

                <Card variant="outlined" sx={{mb: 4}}>
                    <CardContent>
                        <Typography variant="h5" component="h5" gutterBottom fontWeight={"bold"}>
                            판매자님의 코드에 대한 심사 과정은 다음과 같습니다
                        </Typography>
                        <Box height={8}/>
                        <img width={'60%'} alt={'codeRoom Process'}
                             src={'/codeRoom-Process.svg'}
                             style={{border: '2px solid #000', borderRadius: '4px', padding: '16px'}}/>
                    </CardContent>
                </Card>

                <div style={{display: 'flex', justifyContent: 'end'}}>
                <Button onClick={()=> {navigate('/create/code')}} style={{width:'200px',height:'64px'}} variant={"contained"}>코드 올리러 가기</Button>
                </div>

                <Box height={128}/>
            </Box>
        </FullLayout>
    );
};

export default HelpPage;
