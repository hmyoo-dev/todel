import { createStoreAtomHook } from "@todel/react";
import { AxiosInstance } from "axios";
import { atomCreator, AtomSetupPayload } from "todel";
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
      deps: { ajax },
      asyncSetState,
    } = payload;

    return {
      initState,
      modifiers: {
        async fetchNotes(): Promise<NoteItem[]> {
          return asyncSetState({
            memo: "fetch",
            promise: ajax
              .get<NoteItem[]>("/api/notebook/")
              .then((res) => res.data),

            started: (state) => {
              state.fetching = true;
            },
            done: (state, notes) => {
              state.fetching = false;
              state.notes = notes;
            },
            failed: (state) => {
              state.fetching = false;
            },
          });
        },

        async postNote(draft: NoteDraft): Promise<NoteItem> {
          if (getState().pendingUpdate) throw new Error("It's pending");

          return asyncSetState({
            promise: ajax
              .post<NoteItem>("/api/notebook/", draft)
              .then((res) => res.data),
            started: (state) => {
              state.pendingUpdate = true;
            },
            done: (state, note) => {
              state.pendingUpdate = false;
              state.notes.push(note);
            },
            failed: (state) => {
              state.pendingUpdate = false;
            },
          });
        },
      },
    };
  }
);

export type NotesAtom = ReturnType<typeof createNotesAtom>;

export const notesAtomId = "NOTES";

export const useNotesAtom = createStoreAtomHook<NotesAtom>(notesAtomId);
