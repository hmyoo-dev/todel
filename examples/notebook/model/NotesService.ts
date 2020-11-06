import { AxiosInstance } from "axios";
import { Service } from "todel";
import { NoteDraft, NoteItem } from "./dataTypes";

export interface NotesState {
  notes: NoteItem[];
  draft: NoteDraft;
  fetching: boolean;
  posting: boolean;
}

const emptyDraft: NoteDraft = {
  title: "",
  content: "",
};

export class NotesService extends Service<NotesState> {
  constructor(private ajax: AxiosInstance) {
    super({
      notes: [],
      draft: emptyDraft,
      posting: false,
      fetching: false,
    });
  }

  fetchNotes(): Promise<NoteItem[]> {
    this.updateState((state) => ({ ...state, fetching: true }));

    return this.ajax
      .get<NoteItem[]>("/api/notebook/")
      .then((response) => response.data)
      .then((notes) => {
        this.updateState((state) => ({ ...state, fetching: false, notes }));
        return notes;
      });
  }

  postDraftNote(): Promise<NoteItem> {
    const { draft } = this.state;
    this.updateState((state) => ({ ...state, posting: true }));

    return this.ajax
      .post<NoteItem>("/api/notebook/", draft)
      .then((response) => response.data)
      .then((note) => {
        this.updateState((state) => ({ ...state, posting: false }));
        return note;
      });
  }

  updateDraft(draft: NoteDraft): void {
    this.updateState((state) => ({ ...state, draft: { ...draft } }));
  }

  clearDraft(): void {
    this.updateState((state) => ({ ...state, draft: { ...emptyDraft } }));
  }
}

export type NotesServiceHolder = {
  notesService: NotesService;
};

export function selectNotesService(repo: NotesServiceHolder): NotesService {
  return repo.notesService;
}
