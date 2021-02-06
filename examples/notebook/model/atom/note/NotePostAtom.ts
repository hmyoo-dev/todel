import { createAtomHook } from "@todel/react";
import { AsyncAtom, AsyncAtomState, idleAsyncAtomState } from "todel";

export class NotePostAtom extends AsyncAtom<AsyncAtomState> {
  static empty(): NotePostAtom {
    return new NotePostAtom(idleAsyncAtomState());
  }
}

export const notePostAtomId = "NOTE_POST";

export const useNotePostAtom = createAtomHook<NotePostAtom>(
  (repo) => repo[notePostAtomId]
);
