import { act, renderHook } from "@testing-library/react-hooks";
import { useServiceState } from "../src/useServiceState";
import { CounterServiceRepo, increase, setCount } from "./fixtures";
import { createMockStore, createMockWrapper } from "./testHelpers";

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

  it("should throw error if store is not provided", () => {
    const { result } = renderHook(() =>
      useServiceState((repo: CounterServiceRepo) => repo.counter)
    );

    expect(result.error).toBeInstanceOf(Error);
  });

  it("should not trigger render when value is not changed", () => {
    const store = createMockStore();
    let renderedCount = 0;

    const { result } = renderHook(
      () => {
        const count = useServiceState(
          (repo: CounterServiceRepo) => repo.counter,
          (counter) => counter.count
        );
        renderedCount += 1;
        return count;
      },
      { wrapper: createMockWrapper(store) }
    );

    expect(result.current).toEqual(0);
    act(() => store.dispatch(setCount(0)));
    act(() => store.dispatch(setCount(0)));
    act(() => store.dispatch(setCount(0)));

    expect(result.current).toEqual(0);
    expect(renderedCount).toEqual(1);
  });
});
