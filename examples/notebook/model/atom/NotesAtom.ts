import { createStoreAtomHook } from "@todel/react";
import { AxiosInstance } from "axios";
import { atomCreator, AtomSetupPayload, modifier } from "todel";
import { NoteDraft, NoteItem } from "../dataTypes";

export interface NotesAtomState {
  notes: NoteItem[];
  fetching: boolean;
  pendingUpdate: boolean;
}

export interface NotesAtomDeps {
  ajax: AxiosInstance;
}

const initNotesState: NotesAtomState = {
  notes: [],
  fetching: false,
  pendingUpdate: false,
};

export const createNotesAtom = atomCreator(
  (payload: AtomSetupPayload<NotesAtomState, NotesAtomDeps>) => {
    const {
      initState = initNotesState,
      getState,
      setState,
      deps: { ajax },
    } = payload;

    return {
      initState,
      fetchNotes: modifier(async () => {
        setState((state) => ({ ...state, fetching: true }));
        return ajax
          .get<NoteItem[]>("/api/notebook/")
          .then((res) => res.data)
          .then((notes) => {
            setState((state) => ({ ...state, fetching: false, notes }));
            return notes;
          })
          .catch((err) => {
            setState((state) => ({ ...state, fetching: false }));
            throw err;
          });
      }),
      postNote: modifier(
        async (draft: NoteDraft): Promise<NoteItem> => {
          if (getState().pendingUpdate) throw new Error("It's pending");

          setState((state) => ({ ...state, pendingUpdate: true }));
          return ajax
            .post<NoteItem>("/api/notebook/", draft)
            .then((res) => res.data)
            .then((note) => {
              setState((state) => ({
                ...state,
                pendingUpdate: false,
                notes: [...state.notes, note],
              }));
              return note;
            })
            .catch((err) => {
              setState((state) => ({ ...state, pendingUpdate: false }));
              throw err;
            });
        }
      ),
    };
  }
);

export type NotesAtom = ReturnType<typeof createNotesAtom>;

export interface NotesAtomHolder {
  notes: NotesAtom;
}

export const useNotesAtom = createStoreAtomHook(
  (holder: NotesAtomHolder) => holder.notes
);
