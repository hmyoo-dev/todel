import React, { FC } from "react";
import { AjaxStatus } from "todel";
import { useNotesAtom } from "../model/atom/note/NotesAtom";

export const NoteList: FC = () => {
  const { value: notes, status } = useNotesAtom();

  if (status === AjaxStatus.Pending) return <div>Loading...</div>;

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
