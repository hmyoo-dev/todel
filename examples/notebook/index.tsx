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
  NoteDraftAtom,
  noteDraftAtomId,
  NoteDraftAtomProvider,
} from "./model/atom/note/NoteDraftAtom";
import { NotePostAtom, notePostAtomId } from "./model/atom/note/NotePostAtom";
import { NotesAtom, notesAtomId } from "./model/atom/note/NotesAtom";
import { NoticesAtom, noticesAtomId } from "./model/atom/notice/NoticesAtom";
import { NoteController } from "./model/NoteController";
import { NoteAtomsRepo, NotesService } from "./model/service/NotesService";
import { NoticesService } from "./model/service/NoticesService";

interface AtomsRepo extends NoteAtomsRepo {
  [noticesAtomId]: NoticesAtom;
}

const App: FC = () => {
  const ajax = Axios.create();

  const notesAtom = NotesAtom.empty();
  const noteDraftAtom = NoteDraftAtom.empty();
  const notePostAtom = NotePostAtom.empty();
  const noticesAtom = NoticesAtom.empty();

  const atoms: AtomsRepo = {
    [notesAtomId]: notesAtom,
    [noteDraftAtomId]: noteDraftAtom,
    [notePostAtomId]: notePostAtom,
    [noticesAtomId]: noticesAtom,
  };

  const notesService = NotesService.fromRepo(atoms, ajax);
  const noticesService = new NoticesService(noticesAtom);

  const store = new Store<AtomsRepo>({
    atoms,
    controllers: [new NoteController(notesService, noticesService)],
  });

  applyReduxDevtools(store, { name: "NOTEBOOK" });

  useEffect(() => store.dispatch(init()));

  return (
    <StoreProvider store={store}>
      <NoteDraftAtomProvider atom={noteDraftAtom}>
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
