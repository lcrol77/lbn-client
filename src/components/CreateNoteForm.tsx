import React, { useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { GeoJSONPoint } from '../utils/types';
import { useGeoJSONLocation } from '../hooks/useGeoJSONLocation';

interface CreateNoteFormProps {
  newNote: { title: string; body: string; location: GeoJSONPoint };
  setNewNote: (note: { title: string; body: string; location: GeoJSONPoint }) => void;
  creating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const CreateNoteForm: React.FC<CreateNoteFormProps> = ({
  newNote,
  setNewNote,
  creating,
  onSubmit,
  onCancel
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { location, error, isLoading } = useGeoJSONLocation();
  useEffect(() => {
    console.log(location);
  }, [location]);
  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50' }}>
      <Typography variant="h6" gutterBottom>
        Create New Note
      </Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          placeholder="Enter note title..."
          margin="normal"
          required
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Content"
          value={newNote.body}
          onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
          placeholder="Enter note content..."
          margin="normal"
          required
          multiline
          rows={isMobile ? 6 : 4}
          variant="outlined"
          sx={{ mb: 3 }}
        />
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          justifyContent: 'flex-end' 
        }}>
          <Button
            variant="outlined"
            onClick={onCancel}
            fullWidth={isMobile}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={creating}
            startIcon={creating ? <CircularProgress size={20} /> : null}
            fullWidth={isMobile}
          >
            {creating ? 'Creating...' : 'Create Note'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateNoteForm; 