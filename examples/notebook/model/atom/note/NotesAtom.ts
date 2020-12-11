import { Atom } from "todel";
import { NoteItem } from "../../dataTypes";

export interface NotesAtomState {
  notes: NoteItem[];
  fetching: boolean;
}

export class NotesAtom extends Atom<NotesAtomState> {
  static empty(): NotesAtom {
    return new NotesAtom({
      notes: [],
      fetching: false,
    });
  }

  appendNote(note: NoteItem): NoteItem {
    this.updateState((state) => ({ ...state, notes: [...state.notes, note] }));
    return note;
  }

  fetchStart(): void {
    this.updateState((state) => ({ ...state, fetching: true }));
  }

  fetchDone(notes: NoteItem[]): NoteItem[] {
    this.updateState((state) => ({ ...state, notes, fetching: false }));
    return notes;
  }

  fetchFailed(): void {
    this.updateState((state) => ({ ...state, notes: [], fetching: false }));
  }
}

export interface NotesAtomHolder {
  note: {
    notes: NotesAtom;
  };
}

export function selectNotesAtom(repo: NotesAtomHolder): NotesAtom {
  return repo.note.notes;
}
