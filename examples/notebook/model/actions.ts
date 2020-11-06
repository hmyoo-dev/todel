import { actionCreator } from "todel";
import { NoteDraft } from "./dataTypes";

export const init = actionCreator("init");
export const updateDraft = actionCreator<NoteDraft>("updateDraft");
export const postNote = actionCreator("postNote");
