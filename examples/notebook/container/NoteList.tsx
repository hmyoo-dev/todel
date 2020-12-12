import { shallowEqual, useAtom } from "@todel/react";
import React, { FC } from "react";
import { AjaxStatus } from "todel";
import { selectNotesAtom } from "../model/atom/note/NotesAtom";

export const NoteList: FC = () => {
  const { notes, status } = useAtom(
    selectNotesAtom,
    ({ value, status }) => ({ notes: value, status }),
    shallowEqual
  );

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
