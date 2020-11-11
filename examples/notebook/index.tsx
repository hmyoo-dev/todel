import Axios from "axios";
import React, { FC, useEffect } from "react";
import { render } from "react-dom";
import { Store } from "todel";
import { StoreProvider } from "@todel/react";
import { logStore } from "../utils/logStore";
import { NoteForm } from "./container/NoteForm";
import { NoteList } from "./container/NoteList";
import { NotificationBar } from "./container/NotificationBar";
import { init } from "./model/actions";
import { NoteController } from "./model/NoteController";
import { NotesService, NotesServiceHolder } from "./model/NotesService";
import {
  NotificationService,
  NotificationServiceHolder,
} from "./model/NotificationService";

type AppServiceRepo = NotesServiceHolder & NotificationServiceHolder;

const App: FC = () => {
  const ajax = Axios.create();

  const notesService = new NotesService(ajax);
  const notificationService = new NotificationService();

  const store = new Store<AppServiceRepo>({
    services: { notesService, notificationService },
    controllers: [new NoteController(notesService, notificationService)],
  });

  logStore(store);

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
