
// Types based on your Go backend responses
export interface Note {
  _id?: string;
  title?: string;
  body?: string;
  location?: GeoJSONPoint;
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

export interface GeoJSONPoint {
    type: string;
    coordinates: number[];
}