import { renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";
import { AnyStore } from "todel";
import { CounterAtom } from "todel-test-helpers/fixtures";
import { mockStore } from "todel-test-helpers/helpers";
import { StoreProvider } from "../src";
import { createAtomHook } from "../src/createAtomHook";

describe("createAtomsHook", () => {
  const userCounterId = "userCounter";
  const comCounterId = "comCounter";

  let userCounter: CounterAtom;
  let comCounter: CounterAtom;

  let store: AnyStore;
  let wrapper: FC;

  beforeEach(() => {
    userCounter = CounterAtom.fromCount(1);
    comCounter = CounterAtom.fromCount(2);
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
      const useUserCounter = createAtomHook<CounterAtom>(userCounterId);
      const { result } = renderHook(
        () => useUserCounter((atom) => atom.state.count),
        { wrapper }
      );
      expect(result.current).toBe(1);
    });

    it("should be able to pick atoms with names", () => {
      const useCounters = createAtomHook<CounterAtom[]>([
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
      const useCounter = createAtomHook<CounterAtom>((it) => it[comCounterId]);
      const { result } = renderHook(
        () => useCounter((atom) => atom.state.count),
        { wrapper }
      );
      expect(result.current).toBe(2);
    });
  });

  describe("Selector provided hook", () => {
    const useTotalCount = createAtomHook<CounterAtom[], number>(
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
