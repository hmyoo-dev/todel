import { act, renderHook } from "@testing-library/react-hooks";
import { useDispatch } from "../src/useDispatch";
import { increase } from "./fixtures";
import { createMockStore, createMockWrapper } from "./testHelpers";

describe("useDispatch", () => {
  it("should dispatch to store", () => {
    const store = createMockStore();
    const { counter } = store.services;

    const { result } = renderHook(() => useDispatch(), {
      wrapper: createMockWrapper(store),
    });

    expect(counter.data.count).toEqual(0);

    act(() => result.current(increase()));

    expect(counter.data.count).toEqual(1);
  });

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() => useDispatch());

    expect(result.error).toBeInstanceOf(Error);
  });
});
