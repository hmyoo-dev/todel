import { act, renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";
import { Store } from "todel";
import { increase } from "todel-test-helpers/fixtures";
import { StoreProvider } from "../src/StoreProvider";
import { useDispatch } from "../src/useDispatch";

describe("useDispatch", () => {
  it("should dispatch to store", () => {
    const store = new Store({
      atoms: {},
      actionHandlers: [],
    });
    const Wrapper: FC = ({ children }) => (
      <StoreProvider store={store}>{children}</StoreProvider>
    );

    const action = increase();
    const consumer = jest.fn();
    store.subscribeAction(consumer);

    const { result } = renderHook(() => useDispatch(), { wrapper: Wrapper });

    act(() => result.current(action));

    expect(consumer).toHaveBeenCalledWith(action);
  });

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() => useDispatch());

    expect(result.error).toBeInstanceOf(Error);
  });
});
