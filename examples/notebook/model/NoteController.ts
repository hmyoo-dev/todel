import {
  actionHandler,
  ActionHandler,
  combineActionHandlers,
  Controller,
} from "todel";
import { init, postNote, updateDraft } from "./actions";
import { NotesService } from "./NotesService";
import { NotificationService } from "./NotificationService";

export class NoteController implements Controller {
  constructor(
    private notesService: NotesService,
    private notificationService: NotificationService
  ) {}

  getHandler(): ActionHandler {
    return combineActionHandlers([this.init, this.updateDraft, this.postNote]);
  }

  // handlers
  init = actionHandler({
    matcher: init.match,
    handler: () => this.notesService.fetchNotes(),
  });

  updateDraft = actionHandler({
    matcher: updateDraft.match,
    handler: (action) => this.notesService.updateDraft(action.payload),
  });

  postNote = actionHandler({
    matcher: postNote.match,
    handler: () => {
      const { posting, draft } = this.notesService.state;

      if (posting) {
        this.notificationService.notify("Please wait a second");
        return;
      }

      if (isEmpty(draft.title) || isEmpty(draft.content)) {
        this.notificationService.notify("Content should not be empty");
        return;
      }

      return this.notesService
        .postDraftNote()
        .then(() => this.notesService.clearDraft())
        .then(() => this.notesService.fetchNotes());
    },
  });
}

function isEmpty(text: string): boolean {
  return text.trim().length < 1;
}
