export interface NoteItem {
  id: number;
  title: string;
  content: string;
}

export interface NoteDraft {
  title: string;
  content: string;
}

export interface Notification {
  id: number;
  message: string;
}
