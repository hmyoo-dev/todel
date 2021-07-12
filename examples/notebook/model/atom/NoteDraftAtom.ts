import { createLocalAtomContext } from "@todel/react";
import {
  atomCreator,
  AtomMeta,
  AtomSetupPayload,
  computed,
  modifier,
} from "todel";
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
      isFulfilled: computed(() => {
        const { title, content } = getState().draft;
        return [title, content].every((text) => text.trim().length > 0);
      }),
      update: modifier((draft: Partial<NoteDraft>) => {
        setState((state) => {
          state.draft = { ...state.draft, ...draft };
        });
      }),
      clear: modifier(() => {
        setState((state) => {
          state.draft = emptyDraft;
        });
      }),
    };
  }
);

export type NoteDraftAtom = ReturnType<typeof createNoteDraftAtom>;

export const {
  Provider: NoteDraftAtomProvider,
  useLocalAtomData: useNoteDraftAtomData,
  useLocalAtomModifiers: useNoteDraftAtomModifiers,
} = createLocalAtomContext<NoteDraftAtom>();

export interface NoteDraftAtomHolder {
  noteDraft: NoteDraftAtom;
}
