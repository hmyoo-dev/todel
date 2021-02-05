import React, { FC } from "react";
import { useNotesAtom } from "../model/atom/note/NotesAtom";

export const NoteList: FC = () => {
  const { notes, pending } = useNotesAtom((atom) => ({
    notes: atom.state.notes,
    pending: atom.isPending(),
  }));

  if (pending) return <div>Loading...</div>;

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
