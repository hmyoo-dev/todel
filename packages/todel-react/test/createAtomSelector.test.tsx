import { renderHook } from "@testing-library/react-hooks";
import { FC } from "react";
import { Store } from "todel";
import { createAtomSelector, shallowEqual } from "../src";
import { CounterRepo } from "./fixtures";
import { createMockStore, createMockWrapper } from "./testHelpers";

describe("createAtomSelector", () => {
  let store: Store<CounterRepo>;
  let wrapper: FC;

  beforeEach(() => {
    store = createMockStore();
    wrapper = createMockWrapper(store);
  });

  describe("returned hook", () => {
    const useCounterAtom = createAtomSelector(
      (repo: CounterRepo) => repo.counter
    );

    it("should return state without payload", () => {
      const { result } = renderHook(() => useCounterAtom(), {
        wrapper,
      });

      expect(result.current.count).toEqual(0);
    });

    it("should return selected value with data selector", () => {
      const { result } = renderHook(
        () => useCounterAtom((state) => state.count, shallowEqual),
        { wrapper }
      );

      expect(result.current).toEqual(0);
    });
  });
});
