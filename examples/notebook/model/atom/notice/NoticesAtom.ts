import { createAtomHook } from "@todel/react";
import { Atom } from "todel";
import { Notice } from "../../dataTypes";

type Id = number;

export interface NoticesAtomState {
  items: Notice[];
}

export class NoticesAtom extends Atom<NoticesAtomState> {
  private prevId = -1;

  static empty(): NoticesAtom {
    return new NoticesAtom({ items: [] });
  }

  push(message: string): Id {
    const id = ++this.prevId;
    this.updateState((state) => ({
      ...state,
      items: [...state.items, { id, message }],
    }));
    return id;
  }

  delete(id: Id): void {
    this.updateState((state) => ({
      ...state,
      items: state.items.filter((notice) => notice.id !== id),
    }));
  }
}

export const noticesAtomId = "NOTICES";

export const useNoticesAtom = createAtomHook<NoticesAtom>(
  (repo) => repo[noticesAtomId]
);
