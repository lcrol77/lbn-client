import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, Chip } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Note } from '../utils/notesUtil';

interface NoteCardProps {
  note: Note;
  onDelete: (note: Note) => void;
  deleting: string | null;
  formatDate: (dateString?: string) => string;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onDelete,
  deleting,
  formatDate
}) => {
  return (
    <Card>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'stretch', sm: 'flex-start' }, 
          mb: 2,
          gap: 1
        }}>
          <Typography 
            variant="h6" 
            component="h3" 
            sx={{ 
              flexGrow: 1, 
              mr: { xs: 0, sm: 2 },
              wordBreak: 'break-word'
            }}
          >
            {note.title}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            justifyContent: { xs: 'space-between', sm: 'flex-end' }
          }}>
            <Chip
              label={formatDate(note.created_at)}
              size="small"
              variant="outlined"
              color="primary"
            />
            <IconButton
              color="error"
              onClick={() => onDelete(note)}
              disabled={deleting === note._id}
              size="medium"
              sx={{ 
                minWidth: 48,
                minHeight: 48,
                '&:hover': {
                  bgcolor: 'error.light',
                  color: 'white'
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            lineHeight: 1.6
          }}
        >
          {note.body}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NoteCard; 