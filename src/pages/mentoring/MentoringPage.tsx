import React, { FC, useState, useRef } from 'react';
import styled from '@emotion/styled';
import MainLayout from '../../layout/MainLayout';
import { Box, TextField, Button } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
// import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

interface Props {
  children?: React.ReactNode;
}

const CardSection = styled.div`
  width:100%;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const CenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FormContainer = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const MentoringPage: FC<Props> = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
  };

  const handleSubmit = () => {
    // 멘토링 신청 처리 로직
    console.log('Mentoring Request Submitted', { title, content, date });
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    nextRef: React.RefObject<HTMLElement>
  ) => {
    if (event.key === 'Enter' && nextRef.current) {
      nextRef.current.focus();
    }
  };

  return (
    <MainLayout>
      <Box height={128} />
      <CardSection>
        <FormContainer>
          <TextField
            label="멘토링 신청 제목"
            value={title}
            onChange={handleTitleChange}
            fullWidth
            inputRef={titleRef}
            onKeyDown={(e) => handleKeyDown(e, contentRef)}
          />
          <TextField
            label="멘토링 내용"
            value={content}
            onChange={handleContentChange}
            fullWidth
            multiline
            rows={4}
            inputRef={contentRef}
            onKeyDown={(e) => handleKeyDown(e, dateRef)}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="멘토링 가능 일시"
              value={date}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true, inputRef: dateRef, onKeyDown: (e) => handleKeyDown(e, buttonRef) } }}             
            />
          </LocalizationProvider>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
            ref={buttonRef}
          >
            멘토링 신청하기
          </Button>
        </FormContainer>
      </CardSection>
      <Box height={128} />
    </MainLayout>
  );
};

export default MentoringPage;
