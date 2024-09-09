import React from 'react';
import { useNavigate } from "react-router-dom";
import {
    Box,
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    Button,
    Container,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Stepper,
    Step,
    StepLabel,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullLayout from '../../layout/FullLayout';

const HelpPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const steps = ['코드 정리', '관리자 초대', '심사 진행', '판매 시작'];

    return (
        <FullLayout>
            <Container maxWidth="lg">
                <Box py={4}>
                    <Card elevation={3} sx={{ mb: 4, backgroundColor: theme.palette.primary.main, color: 'white' }}>
                        <CardContent>
                            <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                                👨‍💻 코드룸 판매자 가이드 👩‍💻
                            </Typography>
                            <Typography variant="h5" component="h2">
                                판매자님이 정리한 코드 템플릿을 '코드룸'에 직접 올려보세요! 🚀
                            </Typography>
                        </CardContent>
                    </Card>

                    <Stepper activeStep={-1} alternativeLabel={!isSmallScreen} orientation={isSmallScreen ? 'vertical' : 'horizontal'} sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    <Card elevation={2} sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                                1. 코드를 깃허브에 정리하기
                            </Typography>
                            <Typography variant="body1" paragraph>
                                판매자님의 코드를 깃허브 레포지토리에 템플릿 코드의 형태로 정리해보세요.
                            </Typography>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6" color="primary">Github가 처음이라면?</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        <ListItem>
                                            <ListItemText
                                                primary="Github는 개발자들이 소스코드를 관리하고 협업 할 수 있도록 돕는 웹 기반 플랫폼입니다. 코드룸은 Git이라는 버전 관리 시스템과 Github를 이용하여 코드를 저장하고 관리합니다."
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText
                                                primary={
                                                    <React.Fragment>
                                                        1. <Button color="primary" onClick={() => window.open('https://github.com')}>Github 홈페이지</Button>로 이동합니다.
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="2. 회원가입이 안되어있다면 Sign up 버튼을 클릭하여 회원가입을 절차에 따라 완료합니다." />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="3. Github 홈페이지에 Sign in 버튼을 클릭하여 로그인합니다." />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="4. New Repository를 클릭하여 레포지토리를 생성하고 private으로 설정해주세요." />
                                        </ListItem>
                                    </List>
                                </AccordionDetails>
                            </Accordion>
                            <Box mt={2}>
                                <Typography variant="body1" color="error" fontWeight="bold">
                                    🚨 깃허브 레포지토리를 생성 할 때, 반드시 private repository로 생성 해주셔야 합니다 🚨
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card elevation={2} sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                                2. 관리자 초대하기
                            </Typography>
                            <Typography variant="body1" paragraph>
                                1번 과정이 완료되었다면 심사를 위해서 생성한 깃허브 레포지토리에 관리자를 초대 해야 합니다.
                            </Typography>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6" color="primary">깃허브에 관리자 초대</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ol>
                                        <li>
                                            <Typography variant="body1" paragraph>생성된 레포지토리에 들어간후 <strong>Settings</strong>를 클릭합니다.</Typography>
                                            <Box component="img" src='/githubInvite1.png' alt='Github Settings' sx={{ width: '100%', maxWidth: 600, mb: 2, border: '1px solid #ddd', borderRadius: 1 }} />
                                        </li>
                                        <li>
                                            <Typography variant="body1" paragraph>좌측에 있는 <strong>Collaborators</strong>를 클릭한 후 <strong>Add People</strong>를 클릭합니다.</Typography>
                                            <Box component="img" src='/githubInvite2.png' alt='Github Collaborators' sx={{ width: '100%', maxWidth: 600, mb: 2, border: '1px solid #ddd', borderRadius: 1 }} />
                                        </li>
                                        <li>
                                            <Typography variant="body1" paragraph>관리자 닉네임을 입력하여 초대합니다. (관리자 닉네임: <strong>team-code-room</strong>)</Typography>
                                            <Box component="img" src='/githubInvite3.png' alt='Github Invite' sx={{ width: '100%', maxWidth: 600, mb: 2, border: '1px solid #ddd', borderRadius: 1 }} />
                                        </li>
                                    </ol>
                                </AccordionDetails>
                            </Accordion>
                            <Box mt={2}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">자주하는 질문</Typography>
                                <Typography variant="subtitle1" gutterBottom fontWeight="bold">Q: 왜 관리자를 초대해야 되나요?</Typography>
                                <Typography variant="body1">
                                    A: CodeRoom은 게시 요청하신 코드를 내부적인 심사 과정을 걸쳐 최종적으로 코드룸에 게시됩니다. 심사 과정 중 관리자가 직접 깃허브를 검토하기 때문에 관리자를 초대해주셔야 합니다.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>

                    <Card elevation={2} sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h4" component="h3" gutterBottom fontWeight="bold">
                                판매자님의 코드에 대한 심사 과정
                            </Typography>
                            <Box component="img" src='/codeRoom-Process.svg' alt='CodeRoom Process' sx={{ width: '100%', maxWidth: 800, mt: 2, border: '1px solid #ddd', borderRadius: 1, p: 2 }} />
                        </CardContent>
                    </Card>

                    <Box display="flex" justifyContent="center" mt={4}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => window.close()}
                            sx={{ minWidth: 200, height: 56 }}
                        >
                            가이드 나가기
                        </Button>
                    </Box>
                </Box>
            </Container>
        </FullLayout>
    );
};

export default HelpPage;