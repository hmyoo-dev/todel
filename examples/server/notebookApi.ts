import bodyParser from "body-parser";
import { Router } from "express";
import { NoteItem } from "../notebook/model/dataTypes";

let noteId = 0;

const notes: NoteItem[] = [
  { id: noteId, title: "Hello", content: "Hello my note" },
  { id: ++noteId, title: "World", content: "Save our world!" },
];

export const notebookApi = Router()
  .use(bodyParser.json())
  .get("/", async (_, res) => {
    await wait(1000);
    res.json(notes);
  })
  .post("/", async (req, res) => {
    await wait(4000);

    const newNote: NoteItem = { id: ++noteId, ...req.body };
    notes.push(newNote);
    res.status(201).json(newNote);
  });

function wait(duration: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, duration));
}
