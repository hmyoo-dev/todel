import {
  actionHandler,
  ActionHandler,
  combineActionHandlers,
  Controller,
} from "todel";
import { init, postNote, updateDraft } from "./actions";
import { NotesService } from "./service/NotesService";
import { NoticesService } from "./service/NoticesService";

export class NoteController implements Controller {
  constructor(
    private notesService: NotesService,
    private notificationService: NoticesService
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
    handler: () =>
      this.notesService.postDraftNote().catch((err: Error) => {
        this.notificationService.notify(err.message);
      }),
  });
}
