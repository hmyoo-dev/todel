import React, { FC } from "react";
import { useDispatch, useServiceState } from "todel-react";
import { CounterServiceHolder, decrease, increase, reset } from "./model";

export const Counter: FC = () => {
  const dispatch = useDispatch();

  const count = useServiceState(
    (repo: CounterServiceHolder) => repo.counter,
    (state) => state.count
  );

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
