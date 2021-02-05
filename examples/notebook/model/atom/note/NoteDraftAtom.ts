import { createLocalAtomContext } from "@todel/react";
import { Atom, AtomMeta } from "todel";
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

  meta: AtomMeta = {
    devtool: { ignoreUpdate: true },
  };

  isFulfilled = (): boolean => {
    const { title, content } = this.state.draft;
    return [title, content].every((text) => text.trim().length > 0);
  };

  updateDraft = (draft: Partial<NoteDraft>): void => {
    this.updateState((state) => ({
      ...state,
      draft: { ...state.draft, ...draft },
    }));
  };

  clearDraft = (): void => {
    this.updateState((state) => ({ ...state, draft: { ...emptyDraft } }));
  };
}

export const {
  Provider: NoteDraftAtomProvider,
  useLocalAtom: useNoteDraftAtom,
} = createLocalAtomContext<NoteDraftAtom>();

export const noteDraftAtomId = "NOTE_DRAFT";

const emptyDraft: NoteDraft = {
  title: "",
  content: "",
};
