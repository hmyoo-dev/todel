import { act, renderHook } from "@testing-library/react-hooks";
import React, { FC } from "react";
import { counterStoreFixture, increase } from "todel-test-helpers/fixtures";
import { StoreProvider } from "../src/StoreProvider";
import { useDispatch } from "../src/useDispatch";

describe("useDispatch", () => {
  it("should dispatch to store", () => {
    const store = counterStoreFixture();
    const { counter } = store.services;
    const Wrapper: FC = ({ children }) => (
      <StoreProvider store={store}>{children}</StoreProvider>
    );

    const { result } = renderHook(() => useDispatch(), { wrapper: Wrapper });

    expect(counter.state.count).toEqual(0);

    act(() => result.current(increase()));

    expect(counter.state.count).toEqual(1);
  });

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() => useDispatch());

    expect(result.error).toBeInstanceOf(Error);
  });
});
