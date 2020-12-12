import { AjaxAtom, idleAjaxAtomState } from "todel";
import { NoteItem } from "../../dataTypes";

export class NotePostAtom extends AjaxAtom<NoteItem | null> {
  static empty(): NotePostAtom {
    return new NotePostAtom(idleAjaxAtomState(null));
  }
}

export interface NotePostAtomHolder {
  note: {
    post: NotePostAtom;
  };
}

export function selectNotePostAtom(repo: NotePostAtomHolder): NotePostAtom {
  return repo.note.post;
}
