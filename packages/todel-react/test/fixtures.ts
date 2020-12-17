import { actionCreator, ActionHandler, Atom, Controller } from "todel";

// Counter
export const increase = actionCreator("increase");
export const setCount = actionCreator<number>("setCount");

export interface CounterState {
  count: number;
}

export class CounterAtom extends Atom<CounterState> {
  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }
  setCount(count: number): void {
    this.updateState((state) => ({ ...state, count }));
  }
}

export class CounterController implements Controller {
  constructor(private counterAtom: CounterAtom) {}

  getHandler(): ActionHandler {
    return (action) => {
      if (increase.match(action)) {
        this.counterAtom.increase();
        return;
      }
      if (setCount.match(action)) {
        this.counterAtom.setCount(action.payload);
        return;
      }
    };
  }
}
export interface CounterHolder {
  counter: CounterAtom;
}

// List
export interface Item {
  name: string;
}

export const addItem = actionCreator<Item>("addName");
export interface ListState {
  items: Item[];
}

export class ListAtom extends Atom<ListState> {
  append(item: Item): void {
    this.updateState((state) => ({
      ...state,
      items: [...state.items, item],
    }));
  }
}

export class ListController implements Controller {
  constructor(private list: ListAtom) {}

  getHandler(): ActionHandler {
    return (action) => {
      if (addItem.match(action)) {
        this.list.append(action.payload);
        return;
      }
    };
  }
}

export interface ListAtomHolder {
  list: ListAtom;
}
