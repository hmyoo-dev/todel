import React, { FC } from "react";
import { useCounterAtomData, useCounterAtomModifiers } from "./CounterAtom";

export const CounterControl: FC = () => {
  const { increase, decrease, reset } = useCounterAtomModifiers();

  return (
    <div>
      <button onClick={increase}>Increase</button>
      &nbsp;
      <button onClick={decrease}>Decrease</button>
      &nbsp;
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export const CounterCount: FC = () => {
  const count = useCounterAtomData((atom) => atom.state);
  return <h2>{count}</h2>;
};
