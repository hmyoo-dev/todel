import React, { FC } from "react";
import { AnyStore, Store } from "todel";
import { StoreProvider } from "../src/StoreProvider";
import {
  CounterAtom,
  CounterController,
  CounterRepo,
  CounterState,
} from "./fixtures";

export function createMockStore(
  initState: CounterState = { count: 0 }
): Store<CounterRepo> {
  const counter = new CounterAtom(initState);

  return new Store({
    atoms: { counter },
    controllers: [new CounterController(counter)],
  });
}

export function createMockWrapper(store: AnyStore): FC {
  const Wrapper: FC = ({ children }) => (
    <StoreProvider store={store}>{children}</StoreProvider>
  );
  return Wrapper;
}
