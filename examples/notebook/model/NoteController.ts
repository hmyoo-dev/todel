import { ActionEvent, Controller } from "todel";
import { init, postNote, updateDraft } from "./actions";
import { NotesService } from "./NotesService";
import { NotificationService } from "./NotificationService";

export class NoteController implements Controller {
  constructor(
    private notesService: NotesService,
    private notificationService: NotificationService
  ) {}

  listener({ action }: ActionEvent): void | Promise<unknown> {
    if (init.match(action)) {
      return this.notesService.fetchNotes();
    }
    if (updateDraft.match(action)) {
      return this.notesService.updateDraft(action.payload);
    }
    if (postNote.match(action)) {
      return this.postNote();
    }
  }

  postNote(): void | Promise<unknown> {
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
  }
}

function isEmpty(text: string): boolean {
  return text.trim().length < 1;
}
