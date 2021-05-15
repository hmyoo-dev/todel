import React, { FC } from "react";
import { useNotesAtom } from "../model/atom/NotesAtom";

export const NoteList: FC = () => {
  const { notes, pendingUpdate } = useNotesAtom().state;

  if (pendingUpdate) return <div>Loading...</div>;

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
