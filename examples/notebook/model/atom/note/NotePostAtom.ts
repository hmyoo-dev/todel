import { createAtomsHook } from "@todel/react";
import { AsyncAtom, AsyncAtomState, idleAsyncAtomState } from "todel";
import { NoteItem } from "../../dataTypes";

export class NotePostAtom extends AsyncAtom<AsyncAtomState, NoteItem> {
  static empty(): NotePostAtom {
    return new NotePostAtom(idleAsyncAtomState());
  }
}

export const notePostAtomId = "NOTE_POST";

export const useNotePostAtom = createAtomsHook((repo) => [
  repo[notePostAtomId] as NotePostAtom,
]);
