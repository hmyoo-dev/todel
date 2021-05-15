import { actionHandler, ActionHandler, combineActionHandlers } from "todel";
import { init, postNote, updateDraft } from "./actions";
import { NoteDraftAtom } from "./atom/NoteDraftAtom";
import { NotesAtom } from "./atom/NotesAtom";

export function createNoteActionHandler(atoms: {
  draft: NoteDraftAtom;
  notes: NotesAtom;
}): ActionHandler {
  const { notes, draft } = atoms;

  const handlers = {
    init: actionHandler({
      matcher: init.match,
      handler: () => notes.modifiers.fetchNotes(),
    }),

    updateDraft: actionHandler({
      matcher: updateDraft.match,
      handler: (action) => draft.modifiers.update(action.payload),
    }),

    post: actionHandler({
      matcher: postNote.match,
      handler: async () => {
        await notes.modifiers.postNote(draft.state.draft);
        draft.modifiers.clear();
      },
    }),
  };

  return combineActionHandlers(Object.values(handlers));
}
