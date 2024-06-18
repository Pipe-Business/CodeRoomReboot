 import React, {FC, useRef, useState} from 'react';
 interface Props {
   children?: React.ReactNode;
 }
const MentoringPage: FC<Props> = () => {
  return (<></>);
}
  export default MentoringPage;

// import styled from '@emotion/styled';
// import MainLayout from '../../layout/MainLayout';
// import {Box, Button, Paper, TextField, Typography} from '@mui/material';
// import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
// import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFnsV3';
// import {ko} from 'date-fns/locale';
// import {apiClient} from '../../api/ApiClient';
// import {toast} from 'react-toastify';
// import {CodeReviewRequestEntity} from "../../data/entity/CodeReviewRequestEntity";
//
// interface Props {
//   children?: React.ReactNode;
// }
//
// const ContainerSection = styled(Paper)`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   min-height: 300px;
//   background-color: #424242;
//   padding: 32px;
//   text-align: center;
//   box-sizing: border-box;
//   margin-bottom: 32px;
// `;
//
// const CardSection = styled.div`
//   width: 100%;
//   display: flex;
//   flex: 1;
//   flex-direction: column;
//   align-items: center;
// `;
//
// const FormContainer = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: column;
//   gap: 32px;
// `;
//
// const MentoringPage: FC<Props> = () => {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [date, setDate] = useState<Date | null>(null);
//   const [titleError, setTitleError] = useState('');
//   const [contentError, setContentError] = useState('');
//   const [dateError, setDateError] = useState('');
//
//   const titleRef = useRef<HTMLInputElement>(null);
//   const contentRef = useRef<HTMLInputElement>(null);
//   const dateRef = useRef<HTMLInputElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//
//   let requestDate:number;
//
//   const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setTitle(event.target.value);
//     if (event.target.value.length > 60) {
//       setTitleError('코드리뷰 신청 제목은 60자 이하로 입력해 주세요.');
//     } else {
//       setTitleError('');
//     }
//   };
//
//   const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setContent(event.target.value);
//     if (event.target.value.length > 3000) {
//       setContentError('코드리뷰 내용은 3000자 이하로 입력해 주세요.');
//     } else {
//       setContentError('');
//     }
//   };
//
//   const handleDateChange = (newDate: Date | null) => {
//     // requestDate = newDate?.getDate;
//     setDate(newDate);
//     setDateError('');
//   };
//
//   const handleSubmit = async () => {
//     let valid = true;
//
//     if (title.trim() === '') {
//       setTitleError('코드리뷰 신청 제목을 입력해 주세요.');
//       valid = false;
//     } else if (title.length > 60) {
//       setTitleError('코드리뷰 신청 제목은 60자 이하로 입력해 주세요.');
//       valid = false;
//     }
//
//     if (content.trim() === '') {
//       setContentError('코드리뷰 내용을 입력해 주세요.');
//       valid = false;
//     } else if (content.length > 3000) {
//       setContentError('코드리뷰 내용은 3000자 이하로 입력해 주세요.');
//       valid = false;
//     }
//
//     if (date === null) {
//       setDateError('코드리뷰 가능 일시를 선택해 주세요.');
//       valid = false;
//     }
//
//     const user = await apiClient.getCurrentLoginUser();
//     console.log('Mentoring user', user.id);
//
//     const codeReviewEntity: CodeReviewRequestEntity = {
//       title:title,
//       content:content,
//       request_date: date!,
//       to_user_token: "admin",
//       from_user_token : user.id,
//   }
//
//     if (valid) {
//       console.log('Mentoring Request Submitted', { title, content, date });
//       // 추가적인 코드리뷰 신청 처리 로직
//
//       console.log("in page"+{...codeReviewEntity});
//       await apiClient.insertCodeReviewHistory(codeReviewEntity);   // 코드리뷰 히스토리 저장
//       toast.info('코드리뷰 신청이 완료되었습니다.');
//     }
//   };
//
//   const handleKeyDown = (
//     event: React.KeyboardEvent<HTMLInputElement>,
//     nextRef: React.RefObject<HTMLElement>
//   ) => {
//     if (event.key === 'Enter' && nextRef.current) {
//       nextRef.current.focus();
//     }
//   };
//
//   return (
//     <MainLayout>
//       <ContainerSection elevation={3} sx={{ width: { sm: 300, md: 800 } }}>
//         <Typography variant="h4" component="div" color="white" gutterBottom sx={{ textAlign: 'center' }}>
//           CODE ROOM 만의 차별화 된<br />개발자 코드리뷰 서비스
//         </Typography>
//         <Typography variant="body1" component="div" color="white" sx={{ textAlign: 'center' }}>
//           개인 맞춤형 코드리뷰 세션을 통해 코딩 실력을 향상시키세요.<br />
//           프로젝트에 대한 지침을 받고, 모범 사례를 배우고,<br />
//           전문가 멘토와 함께 경력을 발전시키세요.
//         </Typography>
//       </ContainerSection>
//       <CardSection>
//         <FormContainer>
//           <TextField
//             sx={{
//               width: { sm: 300, md: 800 },
//             }}
//             label="코드리뷰 신청 제목"
//             placeholder="카카오 로그인 코드 로직 리뷰"
//             value={title}
//             onChange={handleTitleChange}
//             fullWidth
//             inputRef={titleRef}
//             onKeyDown={(e) => handleKeyDown(e, contentRef)}
//             error={!!titleError}
//             helperText={titleError}
//           />
//           <TextField
//             sx={{
//               width: { sm: 300, md: 800 },
//             }}
//             label="코드리뷰 내용"
//             placeholder="예: 프로젝트 구조, 코드 리뷰 등 구체적으로 입력해 주세요."
//             value={content}
//             onChange={handleContentChange}
//             fullWidth
//             multiline
//             rows={15}
//             inputRef={contentRef}
//             onKeyDown={(e) => handleKeyDown(e, dateRef)}
//             error={!!contentError}
//             helperText={contentError}
//           />
//           <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
//             <DatePicker
//               label="코드리뷰 가능 일시"
//               value={date}
//               onChange={handleDateChange}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   fullWidth
//                   placeholder="예: 2024.05.20"
//                   inputRef={dateRef}
//                   onKeyDown={(e) => handleKeyDown(e, buttonRef)}
//                   error={!!dateError}
//                   helperText={dateError}
//                 />
//               )}
//               inputFormat="yyyy.MM.dd"
//               sx={{
//                 width: { sm: 300, md: 800 },
//               }}
//             />
//           </LocalizationProvider>
//           <Button
//             sx={{
//               width: { sm: 300, md: 800 },
//               height: { sm: 60, md: 100, lg: 100 },
//               fontSize: { sm: '1rem', md: '1.5rem', lg: '2rem' },
//               color: {color: 'white', backgroundColor: '#FF5722'}
//             }}
//             variant="contained"
//             onClick={handleSubmit}
//             fullWidth
//             ref={buttonRef}
//           >
//             코드리뷰 신청하기
//           </Button>
//         </FormContainer>
//       </CardSection>
//       <Box height={128} />
//     </MainLayout>
//   );
// };
//
// export default MentoringPage;
