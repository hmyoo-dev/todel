import { createDataHook } from "@todel/react";
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

export const useNotePostAtom = createDataHook(
  (repo: NotePostAtomHolder) => repo.note.post
);
