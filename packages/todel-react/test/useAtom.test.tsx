import {
  act,
  renderHook,
  RenderHookResult,
} from "@testing-library/react-hooks";
import { Store } from "todel";
import { useAtom } from "../src/useAtom";
import { CounterRepo, CounterState, increase, setCount } from "./fixtures";
import { createMockStore, createMockWrapper } from "./testHelpers";

describe("useAtom", () => {
  type HookResult<R> = RenderHookResult<unknown, R>;
  let store: Store<CounterRepo>;

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
      return mountHook(() => useAtom((repo: CounterRepo) => repo.counter));
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

    it("should not trigger render when value is not changed", () => {
      const componentLogic = jest.fn().mockImplementation(() =>
        useAtom(
          (repo: CounterRepo) => repo.counter,
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
          (repo: CounterRepo) => repo.counter,
          (counter) => counter.count + 10
        )
      );
    }
  });

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() =>
      useAtom((repo: CounterRepo) => repo.counter)
    );

    expect(result.error).toBeInstanceOf(Error);
  });

  function mountHook<R>(hookProvider: () => R): RenderHookResult<unknown, R> {
    return renderHook(hookProvider, { wrapper: createMockWrapper(store) });
  }
});
