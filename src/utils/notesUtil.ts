// Environment configuration
export const NOTES_SERVER = process.env.NOTES_SERVER || 'http://localhost:8080';

// Types based on your Go backend responses
export interface Note {
  id?: string;
  title?: string;
  body?: string;
  created_at?: string;
  updated_at?: string;
}

export interface NoteResponse {
  status: number;
  message: string;
  note?: Note;
  errors?: string[];
  inserted?: any[];
}

export interface NotesResponse {
  status: number;
  message: string;
  Notes: Note[];
  errors?: string[];
}

// Utility functions for notes API calls
export const getNotesServerUrl = () => NOTES_SERVER;

export const helloWorld = async () => {
    const url = getNotesServerUrl();
    const response = await fetch(`${url}`);
    const data = await response.json();
    return data;
}

// Get all notes
export const getNotes = async (): Promise<NotesResponse> => {
    const url = getNotesServerUrl();
    const response = await fetch(`${url}/notes`);
    const data = await response.json();
    return data;
}

// Get a single note by ID
export const getNote = async (id: string): Promise<NoteResponse> => {
    const url = getNotesServerUrl();
    const response = await fetch(`${url}/note/${id}`);
    const data = await response.json();
    return data;
}

// Create a new note
export const createNote = async (note: { title: string; body: string }): Promise<NoteResponse> => {
    const url = getNotesServerUrl();
    const response = await fetch(`${url}/note`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(note),
    });
    const data = await response.json();
    return data;
}

// Helper function to handle API errors
export const handleApiError = (response: Response, data: any) => {
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
}

