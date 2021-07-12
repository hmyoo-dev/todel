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
      asyncSetState,
      deps: { ajax },
    } = payload;

    return {
      initState,
      fetchNotes: modifier(async () => {
        const promise = ajax
          .get<NoteItem[]>("/api/notebook/")
          .then((res) => res.data);

        return asyncSetState({
          memo: "fetch",
          promise,
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
      }),
      postNote: modifier(
        async (draft: NoteDraft): Promise<NoteItem> => {
          if (getState().pendingUpdate) throw new Error("It's pending");

          const promise = ajax
            .post<NoteItem>("/api/notebook/", draft)
            .then((res) => res.data);

          return asyncSetState({
            promise,
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
