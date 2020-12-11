import { Atom } from "todel";

export interface NotePostAtomState {
  posting: boolean;
}

export class NotePostAtom extends Atom<NotePostAtomState> {
  static empty(): NotePostAtom {
    return new NotePostAtom({ posting: false });
  }

  postStarted(): void {
    this.updateState((state) => ({ ...state, posting: true }));
  }

  postEnd(): void {
    this.updateState((state) => ({ ...state, posting: false }));
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
