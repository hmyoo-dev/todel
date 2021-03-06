import { act, renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";
import { CounterAtom, createCounterAtom } from "todel-test-helpers/fixtures";
import { createLocalAtomContext } from "../src/createLocalAtomContext";

describe("createLocalAtomContext", () => {
  const {
    Provider,
    useLocalAtomData,
    useLocalAtomModifiers,
  } = createLocalAtomContext<CounterAtom>();

  let counter: CounterAtom;
  let wrapper: FC;

  beforeEach(() => {
    counter = createCounterAtom({ initState: 0 });
    assignWrapper();
  });

  it("should return provided atom", () => {
    const { result } = renderHook(() => useLocalAtomData(), { wrapper });
    expect(result.current.state).toEqual(0);
  });

  it("should be reactive", () => {
    const { result } = renderHook(
      () => {
        const count = useLocalAtomData((atom) => atom.state);
        const modifiers = useLocalAtomModifiers();
        return { count, modifiers };
      },
      { wrapper }
    );

    expect(result.current.count).toBe(0);
    act(() => result.current.modifiers.increase());
    expect(result.current.count).toBe(1);
  });

  it("should not render when selected value is not changed", () => {
    const renderer = jest.fn(() => {
      const count = useLocalAtomData((atom) => atom.state);
      const { setCount } = useLocalAtomModifiers();
      return { count, setCount };
    });

    const { result } = renderHook(renderer, { wrapper });

    expect(result.current.count).toBe(0);
    act(() => result.current.setCount(0));
    act(() => result.current.setCount(0));
    act(() => result.current.setCount(0));

    expect(renderer).toHaveBeenCalledTimes(1);
  });

  it("should throw when atom is not provided", () => {
    const { result: dataResult } = renderHook(() => useLocalAtomData());
    const { result: modResult } = renderHook(() => useLocalAtomModifiers());

    expect(dataResult.error).toBeInstanceOf(Error);
    expect(modResult.error).toBeInstanceOf(Error);
  });

  function assignWrapper(): void {
    const Wrapper: FC = ({ children }) => (
      <Provider atom={counter}>{children}</Provider>
    );
    wrapper = Wrapper;
  }
});
