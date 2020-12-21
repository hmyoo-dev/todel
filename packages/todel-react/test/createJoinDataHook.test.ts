import { act, renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Store } from "todel";
import { createJoinDataHook } from "../src/createJoinDataHook";
import { addItem, CounterHolder, increase, ListAtomHolder } from "./fixtures";
import { createMockStore, createMockWrapper } from "./testHelpers";

type Repo = CounterHolder & ListAtomHolder;

type Data = [number, number];

describe("createJoinDataHook", () => {
  const useData = createJoinDataHook(
    (repo: Repo) => [repo.counter, repo.list],
    ([counter, list]): Data => [counter.state.count, list.state.items.length]
  );

  let store: Store<Repo>;
  let wrapper: FC;

  beforeEach(() => {
    store = createMockStore();
    wrapper = createMockWrapper(store);
  });

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() => useData());

    expect(result.error).toBeInstanceOf(Error);
  });

  it("should return when atoms updated", () => {
    const { result } = renderHook(() => useData(), { wrapper });
    expect(result.current).toEqual([0, 0]);

    act(() => store.dispatch(increase()));
    act(() => store.dispatch(addItem({ name: "A" })));

    expect(result.current).toEqual([1, 1]);
  });

  it("can pass selector", () => {
    const { result } = renderHook(() => useData((pair) => pair.join(",")), {
      wrapper,
    });

    expect(result.current).toEqual("0,0");
  });

  it("can optimize render with equality function", () => {
    const renderFunc = jest.fn().mockImplementation(() =>
      useData(
        (pair) => pair,
        (prev, next) => prev[1] === next[1]
      )
    );

    const { result } = renderHook(renderFunc, { wrapper });

    expect(result.current).toEqual([0, 0]);

    act(() => store.dispatch(increase()));
    act(() => store.dispatch(increase()));

    expect(result.current).toEqual([0, 0]);
    expect(renderFunc).toHaveBeenCalledTimes(1);
  });
});
