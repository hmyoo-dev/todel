import { StoreProvider } from "@todel/react";
import { applyReduxDevtools } from "@todel/redux-devtools";
import Axios from "axios";
import React, { FC, useEffect } from "react";
import { render } from "react-dom";
import { Store } from "todel";
import { NoteForm } from "./container/NoteForm";
import { NoteList } from "./container/NoteList";
import { NotificationBar } from "./container/NotificationBar";
import { init } from "./model/actions";
import {
  createNoteDraftAtom,
  NoteDraftAtom,
  NoteDraftAtomProvider,
} from "./model/atom/NoteDraftAtom";
import {
  createNotesAtom,
  NotesAtom,
  notesAtomId,
} from "./model/atom/NotesAtom";
import {
  createNoticesAtom,
  NoticesAtom,
  noticesAtomId,
} from "./model/atom/NoticesAtom";
import { createNoteActionHandler } from "./model/noteActionHandler";

interface Atoms {
  [notesAtomId]: NotesAtom;
  [noticesAtomId]: NoticesAtom;
}

function createStore(): { store: Store<Atoms>; draft: NoteDraftAtom } {
  const ajax = Axios.create();

  const draft = createNoteDraftAtom();
  const notes = createNotesAtom({ deps: { ajax } });
  const notices = createNoticesAtom();

  const atoms: Atoms = {
    [notesAtomId]: notes,
    [noticesAtomId]: notices,
  };

  const store = new Store<Atoms>({
    atoms,
    actionHandlers: [createNoteActionHandler({ notes, draft })],
    errorHandler(err) {
      if (err instanceof Error) {
        notices.modifiers.notify(err.message);
      }
    },
  });

  applyReduxDevtools(store, { name: "NOTEBOOK" });
  return { store, draft };
}

const App: FC = () => {
  const { store, draft } = createStore();

  useEffect(() => store.dispatch(init()));

  return (
    <StoreProvider store={store}>
      <NoteDraftAtomProvider atom={draft}>
        <NoteForm />
      </NoteDraftAtomProvider>

      <hr />
      <NotificationBar />
      <hr />
      <NoteList />
    </StoreProvider>
  );
};

render(<App />, document.getElementById("app"));
