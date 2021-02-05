import React, { FC } from "react";
import { useCounterAtom } from "./CounterAtom";

export const CounterControl: FC = () => {
  const counter = useCounterAtom();

  return (
    <div>
      <button onClick={counter.increase}>Increase</button>
      &nbsp;
      <button onClick={counter.decrease}>Decrease</button>
      &nbsp;
      <button onClick={counter.reset}>Reset</button>
    </div>
  );
};

export const CounterCount: FC = () => {
  const count = useCounterAtom((atom) => atom.state.count);
  return <h2>{count}</h2>;
};
