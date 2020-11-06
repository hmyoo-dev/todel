import React, { FC, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useServiceState } from "todel-react";
import { postNote, updateDraft } from "../model/actions";
import { selectNotesService } from "../model/NotesService";

export const NoteForm: FC = () => {
  const dispatch = useDispatch();

  const { draft: storedDraft, posting } = useServiceState(
    selectNotesService,
    ({ draft, posting }) => ({ draft, posting }),
    shallowEqual
  );

  const [title, setTitle] = useState(storedDraft.title);
  const [content, setContent] = useState(storedDraft.content);

  // update form if service state changed.
  useEffect(() => {
    setTitle(storedDraft.title);
    setContent(storedDraft.content);
  }, [storedDraft]);

  const storeDraft = (): void => {
    if (storedDraft.title === title && storedDraft.content === content) return;
    dispatch(updateDraft({ title, content }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        storeDraft();
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
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={storeDraft}
      />

      <textarea
        cols={30}
        rows={10}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={storeDraft}
      ></textarea>

      <button type="submit">Post</button>

      {posting && <div>Pending...</div>}
    </form>
  );
};
