import { StoreProvider } from "@todel/react";
import React, { FC } from "react";
import { render } from "react-dom";
import { Store } from "todel";
import { CounterControl } from "./CounterControl";
import { Counter, CounterController, CounterHolder } from "./model";

const App: FC = () => {
  const counter = Counter.fromCount(0);
  const store = new Store<CounterHolder>({
    atoms: { counter },
    controllers: [new CounterController(counter)],
  });

  return (
    <StoreProvider store={store}>
      <CounterControl />
    </StoreProvider>
  );
};

render(<App />, document.getElementById("app"));
