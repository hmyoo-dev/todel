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
      setState,
      deps: { ajax },
    } = payload;

    return {
      initState,
      modifiers: {
        async fetchNotes(): Promise<NoteItem[]> {
          setState((state) => ({ ...state, fetching: true }));
          try {
            const res = await ajax.get<NoteItem[]>("/api/notebook/");
            const notes = res.data;
            setState((state) => ({ ...state, fetching: false, notes }));
            return notes;
          } catch (err) {
            setState((state) => ({ ...state, fetching: false }));
            throw err;
          }
        },

        async postNote(draft: NoteDraft): Promise<NoteItem> {
          setState((state) => ({ ...state, pendingUpdate: true }));
          try {
            const res = await ajax.post<NoteItem>("/api/notebook/", draft);
            const note = res.data;
            setState((state) => ({
              ...state,
              pendingUpdate: false,
              notes: [...state.notes, note],
            }));

            return note;
          } catch (err) {
            setState((state) => ({ ...state, pendingUpdate: false }));
            throw err;
          }
        },
      },
    };
  }
);

export type NotesAtom = ReturnType<typeof createNotesAtom>;

export const notesAtomId = "NOTES";

export const useNotesAtom = createStoreAtomHook<NotesAtom>(notesAtomId);