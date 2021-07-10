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
import { createNotesAtom } from "./model/atom/NotesAtom";
import { createNoticesAtom } from "./model/atom/NoticesAtom";
import {
  notebookActionHandler,
  NotebookAtoms,
  notebookErrorHandler,
} from "./model/notebookActionHandler";

function createStore(noteDraft: NoteDraftAtom): Store<NotebookAtoms> {
  const ajax = Axios.create();

  const store = new Store<NotebookAtoms>({
    atoms: {
      noteDraft,
      notes: createNotesAtom({ deps: { ajax } }),
      notices: createNoticesAtom(),
    },
    actionHandler: notebookActionHandler,
    errorHandler: notebookErrorHandler,
  });

  applyReduxDevtools(store, { name: "NOTEBOOK" });

  return store;
}

const App: FC = () => {
  const draft = createNoteDraftAtom();
  const store = createStore(draft);

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
