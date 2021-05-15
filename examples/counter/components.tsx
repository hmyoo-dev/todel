import React, { FC } from "react";
import { useCounterAtomData, useCounterAtomModifiers } from "./CounterAtom";

export const CounterControl: FC = () => {
  const modifiers = useCounterAtomModifiers();

  return (
    <div>
      <button onClick={modifiers.increase}>Increase</button>
      &nbsp;
      <button onClick={modifiers.decrease}>Decrease</button>
      &nbsp;
      <button onClick={modifiers.reset}>Reset</button>
    </div>
  );
};

export const CounterCount: FC = () => {
  const count = useCounterAtomData((atom) => atom.state.count);
  return <h2>{count}</h2>;
};
