import React, { useState } from 'react';
import {
    TextField,
    Button,
    Box,
    Paper,
    Typography,
    CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface CommentFormProps {
    addComment: (content: string) => Promise<void>;
    title?: string;
    placeholder?: string;
    buttonText?: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({
                                                            addComment,
                                                            title = "Title",
                                                            placeholder = "Write your comment here...",
                                                            buttonText = "Submit",
                                                        }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim()) {
            setIsSubmitting(true);
            try {
                await addComment(content);
                setContent('');
            } catch (error) {
                console.error("Failed to submit comment:", error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    margin="normal"
                />
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                        disabled={!content.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : buttonText}
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
};