import { renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";
import { AnyStore } from "todel";
import { CounterAtom } from "todel-test-helpers/fixtures";
import { mockStore } from "todel-test-helpers/helpers";
import { StoreProvider } from "../src";
import { createAtomsHook } from "../src/createAtomsHook";

describe("createAtomsHook", () => {
  interface Repo {
    userCount: CounterAtom;
    comCount: CounterAtom;
  }
  let userCount: CounterAtom;
  let comCount: CounterAtom;
  let store: AnyStore;
  let wrapper: FC;

  beforeEach(() => {
    userCount = CounterAtom.fromCount(1);
    comCount = CounterAtom.fromCount(2);
    store = mockStore<Repo>({ userCount, comCount });
    const Wrapper: FC = ({ children }) => (
      <StoreProvider store={store}>{children}</StoreProvider>
    );
    wrapper = Wrapper;
  });

  function selectCounters(repo: Repo): [CounterAtom, CounterAtom] {
    return [repo.userCount, repo.comCount];
  }

  describe("Only atoms picker provided hook", () => {
    const useCounters = createAtomsHook(selectCounters);

    it("should need selector", () => {
      const { result } = renderHook(() => useCounters((_, com) => com), {
        wrapper,
      });

      expect(result.current.state.count).toBe(2);
    });
  });

  describe("Selector provided hook", () => {
    const useTotalCount = createAtomsHook(
      selectCounters,
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
