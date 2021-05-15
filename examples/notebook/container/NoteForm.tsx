import { useDispatch } from "@todel/react";
import React, { FC } from "react";
import { postNote } from "../model/actions";
import {
  useNoteDraftAtomData,
  useNoteDraftAtomModifiers,
} from "../model/atom/NoteDraftAtom";
import { useNotesAtom } from "../model/atom/NotesAtom";

export const NoteForm: FC = () => {
  const dispatch = useDispatch();
  const pending = useNotesAtom((atom) => atom.state.pendingUpdate);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(postNote());
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 400,
        margin: "0 auto",
      }}
    >
      <TitleInput />
      <ContentInput />

      <button type="submit">Post</button>

      {pending && <div>Pending...</div>}
    </form>
  );
};

const TitleInput: FC = () => {
  const title = useNoteDraftAtomData((atom) => atom.state.draft.title);
  const { update } = useNoteDraftAtomModifiers();

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => update({ title: e.currentTarget.value })}
    />
  );
};

const ContentInput: FC = () => {
  const content = useNoteDraftAtomData((atom) => atom.state.draft.content);
  const { update } = useNoteDraftAtomModifiers();

  return (
    <textarea
      cols={30}
      rows={10}
      value={content}
      onChange={(e) => update({ content: e.target.value })}
    ></textarea>
  );
};
