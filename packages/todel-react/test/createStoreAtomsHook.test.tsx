import { renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";
import { AnyStore } from "todel";
import { CounterAtom, createCounterAtom } from "todel-test-helpers/fixtures";
import { mockStore } from "todel-test-helpers/helpers";
import { createStoreAtomHook } from "../src/createStoreAtomHook";
import { StoreProvider } from "../src/StoreProvider";

describe("createStoreAtomsHook", () => {
  const userCounterId = "userCounter";
  const comCounterId = "comCounter";

  let userCounter: CounterAtom;
  let comCounter: CounterAtom;

  let store: AnyStore;
  let wrapper: FC;

  beforeEach(() => {
    userCounter = createCounterAtom({ initState: { count: 1 } });
    comCounter = createCounterAtom({ initState: { count: 2 } });
    store = mockStore({
      [userCounterId]: userCounter,
      [comCounterId]: comCounter,
    });

    const Wrapper: FC = ({ children }) => (
      <StoreProvider store={store}>{children}</StoreProvider>
    );
    wrapper = Wrapper;
  });

  describe("AtomPicker", () => {
    it("should be able to pick by name", () => {
      const useUserCounter = createStoreAtomHook<CounterAtom>(userCounterId);
      const { result } = renderHook(() => useUserCounter(), { wrapper });
      expect(result.current.state.count).toBe(1);
    });

    it("should be able to pick atoms with names", () => {
      const useCounters = createStoreAtomHook<CounterAtom[]>([
        userCounterId,
        comCounterId,
      ]);

      const { result } = renderHook(
        () => useCounters((user, com) => user.state.count + com.state.count),
        { wrapper }
      );

      expect(result.current).toBe(3);
    });

    it("should be able to pick by function", () => {
      const useCounter = createStoreAtomHook<CounterAtom>(
        (it) => it[comCounterId]
      );
      const { result } = renderHook(
        () => useCounter((atom) => atom.state.count),
        { wrapper }
      );
      expect(result.current).toBe(2);
    });
  });

  describe("Selector provided hook", () => {
    const useTotalCount = createStoreAtomHook<CounterAtom[], number>(
      [userCounterId, comCounterId],
      (user, com) => user.state.count + com.state.count
    );

    it("should return result", () => {
      const { result } = renderHook(() => useTotalCount(), { wrapper });

      expect(result.current).toBe(3);
    });

    it("should throw when store is no provided", () => {
      const { result } = renderHook(() => useTotalCount());

      expect(result.error).toBeInstanceOf(Error);
    });
  });
});
