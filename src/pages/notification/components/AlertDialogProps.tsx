import React, { FC, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField } from '@mui/material';

interface AlertDialogProps {
  open: boolean;
  title: string;
  content: string;
  onClose: () => void;
  showReply?: boolean;
}

const AlertDialog: FC<AlertDialogProps> = ({ open, title, content, onClose, showReply }) => {
  const [reply, setReply] = useState('');

  const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = () => {
    // 답장 제출 로직을 여기에 추가합니다.
    console.log('Reply:', reply);
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
            label="Reply"
            type="text"
            fullWidth
            variant="standard"
            value={reply}
            onChange={handleReplyChange}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {showReply && <Button onClick={handleReplySubmit}>Send Reply</Button>}
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
