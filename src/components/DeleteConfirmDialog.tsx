import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box, 
  Typography, 
  IconButton, 
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import { Note } from '../utils/types';

interface DeleteConfirmDialogProps {
  open: boolean;
  noteToDelete: Note | null;
  deleting: string | null;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  open,
  noteToDelete,
  deleting,
  onClose,
  onConfirm
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
          m: isMobile ? 0 : 2,
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon color="error" />
          <Typography variant="h6">Delete Note</Typography>
          {isMobile && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={onClose}
              aria-label="close"
              sx={{ ml: 'auto' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>
          Are you sure you want to delete <strong>"{noteToDelete?.title}"</strong>? 
          <br />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ 
        p: { xs: 2, sm: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 1
      }}>
        <Button 
          onClick={onClose} 
          disabled={deleting === noteToDelete?._id}
          fullWidth={isMobile}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={() => noteToDelete && onConfirm(noteToDelete._id || '')}
          color="error"
          variant="contained"
          disabled={deleting === noteToDelete?._id}
          startIcon={deleting === noteToDelete?._id ? <CircularProgress size={20} /> : null}
          fullWidth={isMobile}
        >
          {deleting === noteToDelete?._id ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmDialog; 