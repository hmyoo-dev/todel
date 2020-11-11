import React, { FC } from "react";
import { render } from "react-dom";
import { Store } from "todel";
import { StoreProvider } from "@todel/react";
import { Counter } from "./Counter";
import {
  CounterController,
  CounterService,
  CounterServiceHolder,
} from "./model";

const App: FC = () => {
  const counter = new CounterService();
  const store = new Store<CounterServiceHolder>({
    services: { counter },
    controllers: [new CounterController(counter)],
  });

  return (
    <StoreProvider store={store}>
      <Counter />
    </StoreProvider>
  );
};

render(<App />, document.getElementById("app"));
