import { Atom } from "todel";
import { NoteDraft } from "../../dataTypes";

export interface NoteDraftAtomState {
  draft: NoteDraft;
}

export interface NoteDraftAtomComputed {
  isFulfilled(): boolean;
}

export class NoteDraftAtom extends Atom<
  NoteDraftAtomState,
  NoteDraftAtomComputed
> {
  static empty(): NoteDraftAtom {
    return new NoteDraftAtom({ draft: emptyDraft });
  }

  get computed(): NoteDraftAtomComputed {
    return {
      isFulfilled: () => {
        const { title, content } = this.state.draft;
        return [title, content].every((text) => text.trim().length > 0);
      },
    };
  }

  updateDraft(draft: NoteDraft): void {
    this.updateState((state) => ({ ...state, draft: { ...draft } }));
  }

  clearDraft(): void {
    this.updateState((state) => ({ ...state, draft: { ...emptyDraft } }));
  }
}

export interface NoteDraftAtomHolder {
  note: {
    draft: NoteDraftAtom;
  };
}

export function selectNoteDraftAtom(repo: NoteDraftAtomHolder): NoteDraftAtom {
  return repo.note.draft;
}

const emptyDraft: NoteDraft = {
  title: "",
  content: "",
};
