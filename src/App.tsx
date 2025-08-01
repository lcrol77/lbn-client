import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Button, 
  Box, 
  Alert, 
  Fab,
  Paper,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getNotes, createNote, deleteNote } from './utils/notesUtil';
import { Note, NotesResponse } from './utils/types';

// Components
import Header from './components/Header';
import CreateNoteForm from './components/CreateNoteForm';
import NotesList from './components/NotesList';
import DeleteConfirmDialog from './components/DeleteConfirmDialog';

// Create a mobile-first custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h1: {
      fontWeight: 700,
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '3rem',
      },
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontSize: '1.25rem',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          minHeight: 48, // Touch-friendly height
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            minHeight: 48, // Touch-friendly height
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          '@media (max-width:600px)': {
            width: 56,
            height: 56,
          },
        },
      },
    },
  },
});

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', body: '' });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  const themeInstance = useTheme();
  const isMobile = useMediaQuery(themeInstance.breakpoints.down('sm'));

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response: NotesResponse = await getNotes();
      setNotes(response.Notes || []);
    } catch (err) {
      setError('Failed to fetch notes');
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.title.trim() || !newNote.body.trim()) {
      setError('Please fill in both title and body');
      return;
    }

    try {
      setCreating(true);
      setError(null);
      await createNote(newNote);
      setNewNote({ title: '', body: '' });
      setShowCreateForm(false);
      await fetchNotes(); // Refresh the notes list
    } catch (err) {
      setError('Failed to create note');
      console.error('Error creating note:', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setDeleting(id);
      setError(null);
      await deleteNote(id);
      await fetchNotes(); // Refresh the notes list
      setShowDeleteConfirm(null);
      setNoteToDelete(null);
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
    } finally {
      setDeleting(null);
    }
  };

  const openDeleteConfirm = (note: Note) => {
    setNoteToDelete(note);
    setShowDeleteConfirm(note._id || '');
  };

  const closeDeleteConfirm = () => {
    setShowDeleteConfirm(null);
    setNoteToDelete(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  const handleCancelCreate = () => {
    setShowCreateForm(false);
    setNewNote({ title: '', body: '' });
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Header 
          title="📝 Location Notes"
          subtitle="Create and manage your notes based on your location"
        />

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 }, px: { xs: 1, sm: 2 } }}>
          <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {/* Header */}
            <Box sx={{ 
              p: { xs: 2, sm: 3 }, 
              bgcolor: 'grey.50', 
              borderBottom: 1, 
              borderColor: 'grey.200' 
            }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between', 
                alignItems: { xs: 'stretch', sm: 'center' }, 
                gap: 2 
              }}>
                <Box>
                  <Typography variant="h4" component="h2" gutterBottom>
                    Your Notes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {notes.length} note{notes.length !== 1 ? 's' : ''}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  fullWidth={isMobile}
                  sx={{ 
                    minWidth: { xs: '100%', sm: 140 },
                    height: { xs: 48, sm: 40 }
                  }}
                >
                  {showCreateForm ? 'Cancel' : 'New Note'}
                </Button>
              </Box>
            </Box>

            {/* Error Message */}
            {error && (
              <Box sx={{ p: { xs: 1, sm: 2 } }}>
                <Alert 
                  severity="error" 
                  onClose={() => setError(null)}
                  sx={{ borderRadius: 2 }}
                >
                  {error}
                </Alert>
              </Box>
            )}

            {/* Create Note Form */}
            {showCreateForm && (
              <CreateNoteForm
                newNote={newNote}
                setNewNote={setNewNote}
                creating={creating}
                onSubmit={handleCreateNote}
                onCancel={handleCancelCreate}
              />
            )}

            {/* Notes List */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <NotesList
                notes={notes}
                loading={loading}
                deleting={deleting}
                onDelete={openDeleteConfirm}
                formatDate={formatDate}
              />
            </Box>
          </Paper>
        </Container>

        {/* Floating Action Button */}
        {!showCreateForm && (
          <Fab
            color="primary"
            aria-label="add note"
            onClick={() => setShowCreateForm(true)}
            sx={{
              position: 'fixed',
              bottom: { xs: 16, sm: 24 },
              right: { xs: 16, sm: 24 },
              zIndex: 1000,
            }}
          >
            <AddIcon />
          </Fab>
        )}

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={!!showDeleteConfirm}
          noteToDelete={noteToDelete}
          deleting={deleting}
          onClose={closeDeleteConfirm}
          onConfirm={handleDeleteNote}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
