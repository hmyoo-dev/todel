import { act, renderHook } from "@testing-library/react-hooks";
import { AnyAtom } from "todel";
import { CounterAtom, createCounterAtom } from "todel-test-helpers/fixtures";
import { useAtomsSubscribe } from "../src/useAtomSubscribe";

describe("useAtomSubscribe", () => {
  let counter: CounterAtom;

  beforeEach(() => {
    counter = createCounterAtom({ initState: 0 });
  });

  it("should return selected value", () => {
    const { result } = renderHook(() =>
      useAtomsSubscribe({
        atoms: [counter],
        selector: selectSingleCounter,
      })
    );

    expect(result.current.state).toEqual(counter.state);
  });

  it("should update when atom updated", () => {
    const { result } = renderHook(() =>
      useAtomsSubscribe({
        atoms: [counter],
        selector: selectSingleCounter,
      })
    );

    expect(result.current.state).toEqual(0);
    act(() => counter.increase());
    expect(result.current.state).toEqual(1);
  });

  it("should optimize render with equality function", () => {
    const render = jest.fn(() =>
      useAtomsSubscribe({
        atoms: [counter],
        selector: selectSingleCounter,
        equalityFn: (prev, next) => prev.state === next.state,
      })
    );

    const { result } = renderHook(render);

    expect(result.current.state).toEqual(0);

    act(() => counter.setCount(0));
    act(() => counter.setCount(0));
    act(() => counter.setCount(0));

    expect(result.current.state).toEqual(0);
    expect(render).toHaveBeenCalledTimes(1);
  });

  it("should unsubscribe when unmount", () => {
    const subscription = { unsubscribe: jest.fn() };
    jest.spyOn(counter, "subscribe").mockReturnValue(subscription);

    const { unmount } = renderHook(() =>
      useAtomsSubscribe({
        atoms: [counter],
        selector: selectSingleCounter,
      })
    );

    unmount();

    expect(subscription.unsubscribe).toHaveBeenCalledTimes(1);
  });
});

function selectSingleCounter(atom: AnyAtom): CounterAtom {
  return atom as CounterAtom;
}
