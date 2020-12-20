import { useDispatch } from "@todel/react";
import React, { FC } from "react";
import { decrease, increase, reset, useCounterData } from "./model";

export const CounterControl: FC = () => {
  const dispatch = useDispatch();

  const count = useCounterData((state) => state.count);

  return (
    <div>
      <h1>Counter</h1>
      <h2>{count}</h2>
      <div>
        <button onClick={() => dispatch(increase())}>Increase</button>{" "}
        <button onClick={() => dispatch(decrease())}>Decrease</button>{" "}
        <button onClick={() => dispatch(reset())}>Reset</button>
      </div>
    </div>
  );
};
