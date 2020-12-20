import { AxiosInstance } from "axios";
import { AjaxStatus } from "todel";
import { NoteDraftAtom, NoteDraftAtomHolder } from "../atom/note/NoteDraftAtom";
import { NotePostAtom, NotePostAtomHolder } from "../atom/note/NotePostAtom";
import { NotesAtom, NotesAtomHolder } from "../atom/note/NotesAtom";
import { NoteDraft, NoteItem } from "../dataTypes";

export type NoteAtomsHolder = NotesAtomHolder &
  NoteDraftAtomHolder &
  NotePostAtomHolder;

export class NotesService {
  constructor(
    private ajax: AxiosInstance,
    private notes: NotesAtom,
    private noteDraft: NoteDraftAtom,
    private notePost: NotePostAtom
  ) {}

  static fromNoteHolder(
    holder: NoteAtomsHolder,
    ajax: AxiosInstance
  ): NotesService {
    return new NotesService(
      ajax,
      holder.note.notes,
      holder.note.draft,
      holder.note.post
    );
  }

  fetchNotes(): Promise<NoteItem[]> {
    return this.notes.updateWith(
      this.ajax
        .get<NoteItem[]>("/api/notebook/")
        .then((response) => response.data)
    );
  }

  async postDraftNote(): Promise<NoteItem> {
    const { draft } = this.noteDraft.state;

    if (this.notePost.data.status === AjaxStatus.Pending) {
      throw new Error("Please until posting is done");
    }

    if (!this.noteDraft.isFulfilled()) {
      throw new Error("Draft should not be empty");
    }

    const note = await this.notePost.updateWith(
      this.ajax
        .post<NoteItem>("/api/notebook/", draft)
        .then((response) => response.data)
    );

    this.notes.appendNote(note);
    this.noteDraft.clearDraft();

    return note;
  }

  updateDraft(draft: NoteDraft): void {
    this.noteDraft.updateDraft(draft);
  }

  clearDraft(): void {
    this.noteDraft.clearDraft();
  }
}
