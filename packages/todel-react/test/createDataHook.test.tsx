import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Store } from "todel";
import { createDataHook } from "../src/createDataHook";
import { CounterHolder, increase, setCount } from "./fixtures";
import { createMockStore, createMockWrapper } from "./testHelpers";

describe("createDataHook", () => {
  let store: Store<CounterHolder>;
  let wrapper: FC;

  const useStateData = createDataHook((repo: CounterHolder) => repo.counter);
  const useModifiedData = createDataHook(
    (repo: CounterHolder) => repo.counter,
    (atom) => ({
      value: atom.state.count + 10,
    })
  );

  beforeEach(() => {
    store = createMockStore();
    wrapper = createMockWrapper(store);
  });

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() => useStateData());

    expect(result.error).toBeInstanceOf(Error);
  });

  it("should return when value updated", () => {
    const { result } = renderHook(() => useStateData(), { wrapper });
    expect(result.current.count).toEqual(0);

    act(() => store.dispatch(increase()));

    expect(result.current.count).toEqual(1);
  });

  it("can pass selector", () => {
    const { result } = renderHook(
      () => useStateData((state) => state.count + 10),
      { wrapper }
    );
    expect(result.current).toEqual(10);
  });

  it("can optimize render with equality function", () => {
    const componentFunc = jest.fn().mockImplementation(() =>
      useStateData(
        (state) => state,
        (prev, next) => prev.count === next.count
      )
    );
    const { result } = renderHook(componentFunc, { wrapper });

    expect(result.current.count).toEqual(0);
    act(() => store.dispatch(setCount(0)));
    act(() => store.dispatch(setCount(0)));
    act(() => store.dispatch(setCount(0)));

    expect(result.current.count).toEqual(0);
    expect(componentFunc).toHaveBeenCalledTimes(1);
  });

  it("should return state as data without data selector", () => {
    const { result } = renderHook(() => useStateData(), { wrapper });
    expect(result.current.count).toEqual(0);
  });

  it("should return delivered data with data selector", () => {
    const { result } = renderHook(() => useModifiedData(), { wrapper });

    expect(result.current.value).toEqual(10);
  });
});
