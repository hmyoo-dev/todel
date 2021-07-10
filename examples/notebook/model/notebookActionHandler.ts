import { ActionErrorHandler, ActionHandlerBuilder } from "todel";
import { init, postNote, updateDraft } from "./actions";
import { NoteDraftAtomHolder } from "./atom/NoteDraftAtom";
import { NotesAtomHolder } from "./atom/NotesAtom";
import { NoticesAtomHolder } from "./atom/NoticesAtom";

export type NotebookAtoms = NoteDraftAtomHolder &
  NotesAtomHolder &
  NoticesAtomHolder;

export const notebookActionHandler = ActionHandlerBuilder.create<
  NotebookAtoms
>()
  .addCase(init.match, (_, { notes }) => {
    notes.modifiers.fetchNotes();
  })
  .addCase(updateDraft.match, (action, { noteDraft }) =>
    noteDraft.modifiers.update(action.payload)
  )
  .addCase(postNote.match, async (_, { notes, noteDraft }) => {
    await notes.modifiers.postNote(noteDraft.state.draft);
    noteDraft.modifiers.clear();
  })
  .build();

export const notebookErrorHandler: ActionErrorHandler<NotebookAtoms> = (
  err,
  { notices }
) => {
  if (err instanceof Error) {
    notices.modifiers.notify(err.message);
  }
};
