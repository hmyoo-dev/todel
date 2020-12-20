import { createDataHook } from "@todel/react";
import { Atom } from "todel";
import { NoteDraft } from "../../dataTypes";

export interface NoteDraftAtomState {
  draft: NoteDraft;
}

export interface NoteDraftData extends NoteDraftAtomState {
  isFulfilled: boolean;
}

export class NoteDraftAtom extends Atom<NoteDraftAtomState> {
  static empty(): NoteDraftAtom {
    return new NoteDraftAtom({ draft: emptyDraft });
  }

  isFulfilled(): boolean {
    const { title, content } = this.state.draft;
    return [title, content].every((text) => text.trim().length > 0);
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

export const useNoteDraftData = createDataHook(
  (repo: NoteDraftAtomHolder): NoteDraftAtom => repo.note.draft,
  (atom): NoteDraftData => ({
    ...atom.state,
    get isFulfilled(): boolean {
      return atom.isFulfilled();
    },
  })
);

const emptyDraft: NoteDraft = {
  title: "",
  content: "",
};
