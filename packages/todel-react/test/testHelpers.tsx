import React, { FC } from "react";
import { AnyStore, Store } from "todel";
import { StoreProvider } from "../src/StoreProvider";
import {
  CounterAtom,
  CounterAtomController,
  CounterAtomRepo,
  CounterController,
  CounterService,
  CounterServiceRepo,
  CounterState,
} from "./fixtures";

export function createMockStore(
  initState: CounterState = { count: 0 }
): Store<CounterServiceRepo> {
  const counter = new CounterService(initState);

  return new Store({
    services: { counter: counter },
    controllers: [new CounterController(counter)],
  });
}

export function createAtomMockStore(
  initState: CounterState = { count: 0 }
): Store<CounterAtomRepo> {
  const counter = new CounterAtom(initState);

  return new Store({
    atoms: { counter },
    controllers: [new CounterAtomController(counter)],
  });
}

export function createMockWrapper(store: AnyStore): FC {
  const Wrapper: FC = ({ children }) => (
    <StoreProvider store={store}>{children}</StoreProvider>
  );
  return Wrapper;
}
