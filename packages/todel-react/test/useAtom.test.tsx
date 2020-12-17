import {
  act,
  renderHook,
  RenderHookResult,
} from "@testing-library/react-hooks";
import { Store } from "todel";
import { useAtom } from "../src/useAtom";
import {
  addItem,
  CounterHolder,
  CounterState,
  increase,
  Item,
  ListAtomHolder,
  setCount,
} from "./fixtures";
import { createMockStore, createMockWrapper } from "./testHelpers";

describe("useAtom", () => {
  type HookResult<R> = RenderHookResult<unknown, R>;
  let store: Store<CounterHolder & ListAtomHolder>;

  beforeEach(() => {
    store = createMockStore();
  });

  describe("when use without data selector", () => {
    it("should return current state", () => {
      const { result } = mountHookWithOutDataSelector();
      expect(result.current.count).toEqual(0);
    });

    it("should update when atom's state updated", () => {
      const { result } = mountHookWithOutDataSelector();
      act(() => store.dispatch(increase()));
      expect(result.current.count).toEqual(1);
    });

    function mountHookWithOutDataSelector(): HookResult<CounterState> {
      return mountHook(() => useAtom((repo: CounterHolder) => repo.counter));
    }
  });

  describe("when use with data selector", () => {
    it("should return current selected value", () => {
      const { result } = mountHookWithDataSelector();
      expect(result.current).toEqual(10);
    });

    it("should return updated selected when atom's state updated", () => {
      const { result } = mountHookWithDataSelector();
      act(() => store.dispatch(increase()));
      expect(result.current).toEqual(11);
    });

    it("should return updated selected when data is array", () => {
      const item: Item = { name: "A" };
      const { result } = mountListAtomHook();
      act(() => store.dispatch(addItem(item)));

      expect(result.current).toEqual([item]);
    });

    it("should not trigger render when value is not changed", () => {
      const componentLogic = jest.fn().mockImplementation(() =>
        useAtom(
          (repo: CounterHolder) => repo.counter,
          (counter) => counter.count
        )
      );

      const { result } = mountHook(componentLogic);

      expect(result.current).toEqual(0);
      act(() => store.dispatch(setCount(0)));
      act(() => store.dispatch(setCount(0)));
      act(() => store.dispatch(setCount(0)));

      expect(result.current).toEqual(0);
      expect(componentLogic).toHaveBeenCalledTimes(1);
    });

    function mountHookWithDataSelector(): HookResult<number> {
      return mountHook(() =>
        useAtom(
          (repo: CounterHolder) => repo.counter,
          (counter) => counter.count + 10
        )
      );
    }

    function mountListAtomHook(): HookResult<Item[]> {
      return mountHook(() =>
        useAtom(
          (repo: ListAtomHolder) => repo.list,
          (state) => state.items
        )
      );
    }
  });

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() =>
      useAtom((repo: CounterHolder) => repo.counter)
    );

    expect(result.error).toBeInstanceOf(Error);
  });

  function mountHook<R>(hookProvider: () => R): RenderHookResult<unknown, R> {
    return renderHook(hookProvider, { wrapper: createMockWrapper(store) });
  }
});
