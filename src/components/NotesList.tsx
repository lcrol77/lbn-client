import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import NoteCard from './NoteCard';
import { Note } from '../utils/types';

interface NotesListProps {
  notes: Note[];
  loading: boolean;
  deleting: string | null;
  onDelete: (note: Note) => void;
  formatDate: (dateString?: string) => string;
}

const NotesList: React.FC<NotesListProps> = ({
  notes,
  loading,
  deleting,
  onDelete,
  formatDate
}) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, sm: 8 } }}>
        <CircularProgress />
      </Box>
    );
  }

  if (notes.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 } }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No notes yet
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create your first note to get started!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {notes.map((note, index) => (
        <NoteCard
          key={note._id || index}
          note={note}
          onDelete={onDelete}
          deleting={deleting}
          formatDate={formatDate}
        />
      ))}
    </Box>
  );
};

export default NotesList; 