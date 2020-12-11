import { shallowEqual, useAtom } from "@todel/react";
import React, { FC } from "react";
import { selectNotesAtom } from "../model/atom/note/NotesAtom";

export const NoteList: FC = () => {
  const { notes, fetching } = useAtom(
    selectNotesAtom,
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
