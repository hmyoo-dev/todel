import { AxiosInstance } from "axios";
import { NoteDraftAtom, noteDraftAtomId } from "../atom/note/NoteDraftAtom";
import { NotePostAtom, notePostAtomId } from "../atom/note/NotePostAtom";
import { NotesAtom, notesAtomId } from "../atom/note/NotesAtom";
import { NoteDraft, NoteItem } from "../dataTypes";

export interface NoteAtomsRepo {
  [noteDraftAtomId]: NoteDraftAtom;
  [notePostAtomId]: NotePostAtom;
  [notesAtomId]: NotesAtom;
}

export class NotesService {
  constructor(
    private ajax: AxiosInstance,
    private notes: NotesAtom,
    private noteDraft: NoteDraftAtom,
    private notePost: NotePostAtom
  ) {}

  static fromRepo(repo: NoteAtomsRepo, ajax: AxiosInstance): NotesService {
    return new NotesService(
      ajax,
      repo[notesAtomId],
      repo[noteDraftAtomId],
      repo[notePostAtomId]
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

    if (this.notePost.isPending()) {
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

    this.noteDraft.clearDraft();
    this.notes.appendNote(note);

    return note;
  }

  updateDraft(draft: NoteDraft): void {
    this.noteDraft.updateDraft(draft);
  }

  clearDraft(): void {
    this.noteDraft.clearDraft();
  }
}
