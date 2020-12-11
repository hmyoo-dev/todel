import { AxiosInstance } from "axios";
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
    this.notes.fetchStart();

    return this.ajax
      .get<NoteItem[]>("/api/notebook/")
      .then((response) => response.data)
      .then((notes) => this.notes.fetchDone(notes));
  }

  async postDraftNote(): Promise<NoteItem> {
    const { draft, isFulfilled } = this.noteDraft.data;

    if (this.notePost.data.posting) {
      throw new Error("Please until posting is done");
    }

    if (!isFulfilled()) {
      throw new Error("Draft should not be empty");
    }

    this.notePost.postStarted();

    const note = await this.ajax
      .post<NoteItem>("/api/notebook/", draft)
      .then((response) => response.data);

    this.notes.appendNote(note);
    this.notePost.postEnd();
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
