import { useDispatch } from "@todel/react";
import React, { FC } from "react";
import { postNote } from "../model/actions";
import { useNoteDraftAtom } from "../model/atom/note/NoteDraftAtom";
import { useNotePostAtom } from "../model/atom/note/NotePostAtom";

export const NoteForm: FC = () => {
  const dispatch = useDispatch();
  const pending = useNotePostAtom((atom) => atom.isPending());

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
  const { title, updateDraft } = useNoteDraftAtom((atom) => ({
    title: atom.state.draft.title,
    updateDraft: atom.updateDraft,
  }));

  return (
    <input
      type="text"
      value={title}
      onChange={(e) => updateDraft({ title: e.currentTarget.value })}
    />
  );
};

const ContentInput: FC = () => {
  const { content, updateDraft } = useNoteDraftAtom((atom) => ({
    content: atom.state.draft.content,
    updateDraft: atom.updateDraft,
  }));

  return (
    <textarea
      cols={30}
      rows={10}
      value={content}
      onChange={(e) => updateDraft({ content: e.target.value })}
    ></textarea>
  );
};
