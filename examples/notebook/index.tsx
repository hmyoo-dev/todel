import { StoreProvider } from "@todel/react";
import Axios from "axios";
import React, { FC, useEffect } from "react";
import { render } from "react-dom";
import { Store } from "todel";
import { NoteForm } from "./container/NoteForm";
import { NoteList } from "./container/NoteList";
import { NotificationBar } from "./container/NotificationBar";
import { init } from "./model/actions";
import { NoteDraftAtom } from "./model/atom/note/NoteDraftAtom";
import { NotePostAtom } from "./model/atom/note/NotePostAtom";
import { NotesAtom } from "./model/atom/note/NotesAtom";
import {
  NoticesAtom,
  NoticesAtomHolder,
} from "./model/atom/notice/NoticesAtom";
import { NoteController } from "./model/NoteController";
import { NoteAtomsHolder, NotesService } from "./model/service/NotesService";
import { NoticesService } from "./model/service/NoticesService";

type AppAtoms = NoteAtomsHolder & NoticesAtomHolder;

const App: FC = () => {
  const ajax = Axios.create();
  const atoms: AppAtoms = {
    note: {
      notes: NotesAtom.empty(),
      draft: NoteDraftAtom.empty(),
      post: NotePostAtom.empty(),
    },
    notice: NoticesAtom.empty(),
  };

  const notesService = NotesService.fromNoteHolder(atoms, ajax);
  const noticesService = new NoticesService(atoms.notice);

  const store = new Store<AppAtoms>({
    atoms,
    controllers: [new NoteController(notesService, noticesService)],
  });

  useEffect(() => store.dispatch(init()));

  return (
    <StoreProvider store={store}>
      <NoteForm />
      <hr />
      <NotificationBar />
      <hr />
      <NoteList />
    </StoreProvider>
  );
};

render(<App />, document.getElementById("app"));
