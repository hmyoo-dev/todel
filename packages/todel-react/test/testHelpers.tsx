import React, { FC } from "react";
import { AnyStore, Store } from "todel";
import { StoreProvider } from "../src/StoreProvider";
import {
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

export function createMockWrapper(store: AnyStore): FC {
  const Wrapper: FC = ({ children }) => (
    <StoreProvider store={store}>{children}</StoreProvider>
  );
  return Wrapper;
}
