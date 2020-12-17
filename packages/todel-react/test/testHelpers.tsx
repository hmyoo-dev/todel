import React, { FC } from "react";
import { AnyStore, Store } from "todel";
import { StoreProvider } from "../src/StoreProvider";
import {
  CounterAtom,
  CounterController,
  CounterHolder,
  CounterState,
  ListAtom,
  ListAtomHolder,
  ListController,
} from "./fixtures";

export function createMockStore(
  initState: CounterState = { count: 0 }
): Store<CounterHolder & ListAtomHolder> {
  const counter = new CounterAtom(initState);
  const list = new ListAtom({ items: [] });

  return new Store({
    atoms: { counter, list },
    controllers: [new CounterController(counter), new ListController(list)],
  });
}

export function createMockWrapper(store: AnyStore): FC {
  const Wrapper: FC = ({ children }) => (
    <StoreProvider store={store}>{children}</StoreProvider>
  );
  return Wrapper;
}
