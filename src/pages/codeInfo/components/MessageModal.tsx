// src/components/MessageModal.js

import React, { FC, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { apiClient } from '../../../api/ApiClient';
import { toast } from 'react-toastify';

interface MessageModalProps {
  targetUserToken: string;
}

const MessageModal: FC<MessageModalProps> = ({targetUserToken}) => {
  const [isMessageModalOpen, setMessageModalOpen] = useState(false);
  const [content, setContent] = useState('');

  const handleOpenMessageModal = () => setMessageModalOpen(true);
  const handleCloseMessageModal = () => setMessageModalOpen(false);

  const handleSendMessage = async () => {
    // 메시지 전송 로직
    
    await apiClient.replyMessageToUser(content, targetUserToken);
    toast.success('쪽지가 전송되었습니다');
    console.log('content:', );
    setMessageModalOpen(false);
  };

  const handleContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    setContent(event.target.value);
  };

  return (
    <div>
      <Button onClick={handleOpenMessageModal} variant="contained" color="primary" sx={{ fontSize: '15', width: '210px', height : '52px' }}>
        1:1 쪽지 보내기
      </Button>

      <Dialog open={isMessageModalOpen} onClose={handleCloseMessageModal}>
        <DialogTitle>1:1 쪽지 보내기</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="메시지"
            type="text"
            fullWidth
            variant="outlined"
            value={content}
            onChange={handleContentChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMessageModal} color="primary">
            취소
          </Button>
          <Button color="primary" onClick={handleSendMessage}>
            전송
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MessageModal;
