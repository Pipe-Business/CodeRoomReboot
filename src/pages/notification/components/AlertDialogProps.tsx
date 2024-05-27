import React, { FC, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { apiClient } from '../../../api/ApiClient';
import { toast } from 'react-toastify';

interface AlertDialogProps {
  open: boolean;
  title: string;
  content: string;
  fromUserToken: string;
  onClose: () => void;
  showReply?: boolean;
}

const AlertDialog: FC<AlertDialogProps> = ({ open, title, content, fromUserToken, onClose, showReply }) => {  
  const [replyContent, setReplyContent] = useState('');

  const handleReplyContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    setReplyContent(event.target.value);
  };

  const handleReplySubmit = async () => {
    // 답장 제출 로직
    await apiClient.replyMessageToUser(replyContent, fromUserToken);
    toast.success('쪽지가 전송되었습니다');
    console.log('Reply content:', replyContent);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>        
        {showReply && (        
          <TextField
            autoFocus
            margin="dense"
            label="내용 입력"
            type="text"
            fullWidth
            variant="standard"
            value={replyContent}
            onChange={handleReplyContentChange}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>닫기</Button>
        {showReply && <Button onClick={handleReplySubmit}>답장하기</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
