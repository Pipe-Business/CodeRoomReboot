import React, { FC, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import { apiClient } from '../../../../api/ApiClient';

interface AdminMessageDialogProps {
  open: boolean;
  title: string;
  content: string;
  targetUserToken: string;
  onClose: () => void;
  showReply?: boolean;
}

const AdminMessageDialog: FC<AdminMessageDialogProps> = ({ open, title, content, targetUserToken, onClose, showReply }) => {  
  const [replyContent, setReplyContent] = useState('');

  const handleReplyContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {    
    setReplyContent(event.target.value);
  };

  const handleReplySubmit = async () => {
    // 답장 제출 로직
    await apiClient.messageFromAdminToUser(replyContent, targetUserToken);
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
        {showReply && <Button onClick={handleReplySubmit}>전송하기</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default AdminMessageDialog;
