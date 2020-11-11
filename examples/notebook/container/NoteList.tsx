import React, { FC } from "react";
import { shallowEqual, useServiceState } from "@todel/react";
import { selectNotesService } from "../model/NotesService";

export const NoteList: FC = () => {
  const { notes, fetching } = useServiceState(
    selectNotesService,
    ({ notes, fetching }) => ({ notes, fetching }),
    shallowEqual
  );

  if (fetching) return <div>Loading...</div>;

  const noteNodes = notes.map(({ id, title, content }) => (
    <li key={id}>
      <dl>
        <dt>{title}</dt>
        <dd>{content}</dd>
      </dl>
    </li>
  ));

  return <ul>{noteNodes}</ul>;
};
