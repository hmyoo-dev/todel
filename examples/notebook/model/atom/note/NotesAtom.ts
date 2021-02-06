import { createAtomHook } from "@todel/react";
import { AsyncAtom, AsyncAtomState, idleAsyncAtomState } from "todel";
import { NoteItem } from "../../dataTypes";

export interface NotesAtomState extends AsyncAtomState {
  notes: NoteItem[];
}
export class NotesAtom extends AsyncAtom<NotesAtomState, NoteItem[]> {
  static empty(): NotesAtom {
    return new NotesAtom({ ...idleAsyncAtomState(), notes: [] });
  }

  appendNote(note: NoteItem): NoteItem {
    this.updateState((state) => ({ ...state, notes: [...state.notes, note] }));
    return note;
  }

  protected updateStarted(state: NotesAtomState): NotesAtomState {
    return { ...state, notes: [] };
  }

  protected updateDone(
    state: NotesAtomState,
    notes: NoteItem[]
  ): NotesAtomState {
    return { ...state, notes };
  }

  protected updateFailed(state: NotesAtomState): NotesAtomState {
    return { ...state, notes: [] };
  }
}

export const notesAtomId = "NOTES";

export const useNotesAtom = createAtomHook<NotesAtom>(
  (repo) => repo[notesAtomId]
);
