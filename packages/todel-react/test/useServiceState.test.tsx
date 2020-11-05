import { act, renderHook } from "@testing-library/react-hooks";
import { CounterServiceRepo, increase } from "./fixtures";
import { createMockStore, createMockWrapper } from "./testHelpers";
import { useServiceState } from "../src/useServiceState";

describe("useServiceState", () => {
  it("should return service state", () => {
    const store = createMockStore();

    const { result } = renderHook(
      () => useServiceState((repo: CounterServiceRepo) => repo.counter),
      { wrapper: createMockWrapper(store) }
    );

    expect(result.current.count).toEqual(0);

    act(() => store.dispatch(increase()));

    expect(result.current.count).toEqual(1);
  });

  it("can return with state selector", () => {
    const store = createMockStore();

    const { result } = renderHook(
      () =>
        useServiceState(
          (repo: CounterServiceRepo) => repo.counter,
          (counter) => counter.count * 10
        ),
      { wrapper: createMockWrapper(store) }
    );

    expect(result.current).toEqual(0);

    act(() => store.dispatch(increase()));

    expect(result.current).toEqual(10);
  });
});
