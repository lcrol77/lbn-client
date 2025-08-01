import React, { useState, useEffect } from 'react';
import { getNotes, createNote, deleteNote, Note, NotesResponse } from './utils/notesUtil';
import './App.css';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', body: '' });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

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
    } catch (err) {
      setError('Failed to delete note');
      console.error('Error deleting note:', err);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Location Based Notes</h1>
        <p>Create and manage your notes based on your location</p>
      </header>

      <main className="App-main">
        <div className="notes-container">
          <div className="notes-header">
            <h2>Your Notes ({notes.length})</h2>
            <button 
              className="create-btn"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              {showCreateForm ? 'Cancel' : '+ New Note'}
            </button>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Create Note Form */}
          {showCreateForm && (
            <div className="create-form">
              <h3>Create New Note</h3>
              <form onSubmit={handleCreateNote}>
                <div className="form-group">
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    id="title"
                    value={newNote.title}
                    onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                    placeholder="Enter note title..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content">Content:</label>
                  <textarea
                    id="content"
                    value={newNote.body}
                    onChange={(e) => setNewNote({ ...newNote, body: e.target.value })}
                    placeholder="Enter note content..."
                    rows={4}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={creating}
                  >
                    {creating ? 'Creating...' : 'Create Note'}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewNote({ title: '', body: '' });
                      setError(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Notes List */}
          <div className="notes-list">
            {loading ? (
              <div className="loading">Loading notes...</div>
            ) : notes.length === 0 ? (
              <div className="empty-state">
                <p>No notes yet. Create your first note!</p>
              </div>
            ) : (
              notes.map((note, index) => (
                <div key={note._id || index} className="note-card">
                  <div className="note-header">
                    <h3>{note.title}</h3>
                    <div className="note-actions">
                      <span className="note-date">
                        {formatDate(note.created_at)}
                      </span>
                      <button
                        className="delete-btn"
                        onClick={() => 
                          setShowDeleteConfirm(note._id || '')}
                        disabled={deleting === note._id}
                        title="Delete note"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="note-content">
                    {note.body}
                  </div>
                  
                  {/* Delete Confirmation Modal */}
                  {showDeleteConfirm === note._id && (
                    <div className="delete-confirm-overlay">
                      <div className="delete-confirm-modal">
                        <h4>Delete Note</h4>
                        <p>Are you sure you want to delete "{note.title}"? This action cannot be undone.</p>
                        <div className="delete-confirm-actions">
                          <button
                            className="delete-confirm-btn"
                            onClick={() => handleDeleteNote(note._id || '')}
                            disabled={deleting === note._id}
                          >
                            {deleting === note._id ? 'Deleting...' : 'Delete'}
                          </button>
                          <button
                            className="cancel-btn"
                            onClick={() => setShowDeleteConfirm(null)}
                            disabled={deleting === note._id}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
