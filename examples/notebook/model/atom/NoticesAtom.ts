import { createStoreAtomHook } from "@todel/react";
import { atomCreator, AtomSetupPayload } from "todel";
import { Notice } from "../dataTypes";

type Id = number;

export interface NoticesAtomState {
  items: Notice[];
}

export const createNoticesAtom = atomCreator(
  (payload: AtomSetupPayload<NoticesAtomState>) => {
    const { initState = { items: [] }, setState } = payload;
    let prevId = -1;

    function push(message: string): Id {
      const id = ++prevId;
      setState((state) => {
        state.items.push({ id, message });
      });
      return id;
    }

    function del(id: Id): void {
      setState((state) => {
        state.items = state.items.filter((item) => item.id !== id);
      });
    }

    return {
      initState,
      modifiers: {
        notify(message: string): Id {
          const id = push(message);
          setTimeout(() => del(id), 2000);
          return id;
        },
      },
    };
  }
);

export type NoticesAtom = ReturnType<typeof createNoticesAtom>;

export interface NoticesAtomHolder {
  notices: NoticesAtom;
}

export const useNoticesAtom = createStoreAtomHook(
  (holder: NoticesAtomHolder) => holder.notices
);
