import { createMockStore, createMockWrapper } from "./testHelpers";
import { useDispatch } from "../src/useDispatch";
import { act, renderHook } from "@testing-library/react-hooks";
import { increase } from "./fixtures";

describe("useDispatch", () => {
  it("should dispatch to store", () => {
    const store = createMockStore();
    const { counter } = store.services;

    const { result } = renderHook(() => useDispatch(), {
      wrapper: createMockWrapper(store),
    });

    expect(counter.state.count).toEqual(0);

    act(() => result.current(increase()));

    expect(counter.state.count).toEqual(1);
  });

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() => useDispatch());

    expect(result.error).toBeInstanceOf(Error);
  });
});
