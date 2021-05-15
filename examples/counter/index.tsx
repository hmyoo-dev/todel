import React, { FC } from "react";
import { render } from "react-dom";
import { CounterControl, CounterCount } from "./components";
import { CounterProvider, createCounterAtom } from "./CounterAtom";

const App: FC = () => {
  const counterAtom = createCounterAtom();

  return (
    <CounterProvider atom={counterAtom}>
      <h1>Counter</h1>
      <CounterCount />
      <CounterControl />
    </CounterProvider>
  );
};

render(<App />, document.getElementById("app"));
