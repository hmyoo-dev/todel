import { act, renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";
import { CounterAtom } from "todel-test-helpers/fixtures";
import { createLocalAtomContext } from "../src/createLocalAtomContext";

describe("createLocalAtomContext", () => {
  const { Provider, useLocalAtom } = createLocalAtomContext<CounterAtom>();

  let counter: CounterAtom;
  let wrapper: FC;

  beforeEach(() => {
    counter = CounterAtom.fromCount(0);
    assignWrapper();
  });

  it("should return provided atom", () => {
    const { result } = renderHook(() => useLocalAtom(), { wrapper });
    expect(result.current).toBe(counter);
  });

  it("should be able to select value", () => {
    const { result } = renderHook(
      () => useLocalAtom((atom) => atom.state.count),
      { wrapper }
    );

    expect(result.current).toBe(0);
    act(() => counter.increase());
    expect(result.current).toBe(1);
  });

  it("should not render when selected value is not changed", () => {
    const renderer = jest
      .fn<number, []>()
      .mockImplementation(() => useLocalAtom((atom) => atom.state.count));

    const { result } = renderHook(renderer, { wrapper });

    expect(result.current).toBe(0);
    act(() => counter.setCount(0));
    act(() => counter.setCount(0));
    act(() => counter.setCount(0));

    expect(renderer).toHaveBeenCalledTimes(1);
  });

  it("should throw when atom is not provided", () => {
    const { result } = renderHook(() => useLocalAtom());

    expect(result.error).toBeInstanceOf(Error);
  });

  function assignWrapper(): void {
    const Wrapper: FC = ({ children }) => (
      <Provider atom={counter}>{children}</Provider>
    );
    wrapper = Wrapper;
  }
});
