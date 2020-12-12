import { AjaxAtom, idleAjaxAtomState } from "todel";
import { NoteItem } from "../../dataTypes";

export class NotesAtom extends AjaxAtom<NoteItem[]> {
  static empty(): NotesAtom {
    return new NotesAtom(idleAjaxAtomState([]));
  }

  appendNote(note: NoteItem): NoteItem {
    this.updateState((state) => ({ ...state, value: [...state.value, note] }));
    return note;
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
