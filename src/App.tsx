import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Alert, 
  CircularProgress,
  Chip,
  Fab,
  Paper,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { getNotes, createNote, deleteNote, Note, NotesResponse } from './utils/notesUtil';

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

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={0} sx={{ bgcolor: 'primary.main' }}>
          <Toolbar sx={{ minHeight: { xs: 48, sm: 64 }, py: { xs: 0.5, sm: 1 } }}>
            <LocationIcon sx={{ mr: 1, fontSize: { xs: 18, sm: 24 } }} />
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                flexGrow: 1,
                fontSize: { xs: '0.875rem', sm: '1.25rem' },
                fontWeight: { xs: 500, sm: 600 }
              }}
            >
              Location Notes
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Hero Section */}
        <Box sx={{ 
          bgcolor: 'primary.main', 
          color: 'white', 
          py: { xs: 2, sm: 6, md: 8 }, 
          textAlign: 'center' 
        }}>
          <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
            <Typography 
              variant="h1" 
              component="h1" 
              gutterBottom
              sx={{ mb: { xs: 1, sm: 3 } }}
            >
              📝 Location Notes
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                opacity: 0.9,
                fontSize: { xs: '0.875rem', sm: '1.25rem' }
              }}
            >
              Create and manage your notes based on your location
            </Typography>
          </Container>
        </Box>

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
                  startIcon={<AddIcon />}
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
              <Box sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50' }}>
                <Typography variant="h6" gutterBottom>
                  Create New Note
                </Typography>
                <Box component="form" onSubmit={handleCreateNote} sx={{ mt: 2 }}>
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
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewNote({ title: '', body: '' });
                        setError(null);
                      }}
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
            )}

            {/* Notes List */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: { xs: 6, sm: 8 } }}>
                  <CircularProgress />
                </Box>
              ) : notes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8 } }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No notes yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create your first note to get started!
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {notes.map((note, index) => (
                    <Card key={note._id || index}>
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
                              onClick={() => openDeleteConfirm(note)}
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
                  ))}
                </Box>
              )}
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
        <Dialog
          open={!!showDeleteConfirm}
          onClose={closeDeleteConfirm}
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
                  onClick={closeDeleteConfirm}
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
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This action cannot be undone.
              </Typography>
            </Typography>
          </DialogContent>
          <DialogActions sx={{ 
            p: { xs: 2, sm: 3 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 1
          }}>
            <Button 
              onClick={closeDeleteConfirm} 
              disabled={deleting === noteToDelete?._id}
              fullWidth={isMobile}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={() => noteToDelete && handleDeleteNote(noteToDelete._id || '')}
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
      </Box>
    </ThemeProvider>
  );
}

export default App;
