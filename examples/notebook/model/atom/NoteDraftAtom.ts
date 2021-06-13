import { createLocalAtomContext } from "@todel/react";
import { atomCreator, AtomMeta, AtomSetupPayload } from "todel";
import { NoteDraft } from "../dataTypes";

export interface NoteDraftAtomState {
  draft: NoteDraft;
}

const emptyDraft: NoteDraft = {
  title: "",
  content: "",
};

const initDraftState: NoteDraftAtomState = { draft: emptyDraft };
export interface NoteDraftData extends NoteDraftAtomState {
  isFulfilled: boolean;
}

type NoteDraftSetupPayload = AtomSetupPayload<NoteDraftAtomState>;

export const createNoteDraftAtom = atomCreator(
  (payload: NoteDraftSetupPayload) => {
    const { initState = initDraftState, getState, setState } = payload;
    const meta: AtomMeta = { devtool: { ignoreUpdate: true } };

    return {
      initState,
      meta,
      computed: {
        isFulfilled(): boolean {
          const { title, content } = getState().draft;
          return [title, content].every((text) => text.trim().length > 0);
        },
      },
      modifiers: {
        update(draft: Partial<NoteDraft>): void {
          setState((state) => {
            state.draft = { ...state.draft, ...draft };
          });
        },
        clear(): void {
          setState((state) => {
            state.draft = emptyDraft;
          });
        },
      },
    };
  }
);

export type NoteDraftAtom = ReturnType<typeof createNoteDraftAtom>;

export const {
  Provider: NoteDraftAtomProvider,
  useLocalAtomData: useNoteDraftAtomData,
  useLocalAtomModifiers: useNoteDraftAtomModifiers,
} = createLocalAtomContext<NoteDraftAtom>();

export const noteDraftAtomId = "NOTE_DRAFT";
