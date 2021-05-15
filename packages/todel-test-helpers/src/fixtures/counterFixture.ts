import { actionCreator, atomCreator, AtomSetupPayload } from "todel";

export const increase = actionCreator("increase");
export const setCount = actionCreator<number>("setCount");

export interface CounterState {
  count: number;
}

export const createCounterAtom = atomCreator(
  (payload: AtomSetupPayload<CounterState>) => {
    const { initState = { count: 0 }, setState } = payload;
    return {
      initState,
      modifiers: {
        increase(): void {
          setState((state) => ({ ...state, count: state.count + 1 }));
        },
        setCount(count: number): void {
          setState((state) => ({ ...state, count }));
        },
      },
    };
  }
);

export type CounterAtom = ReturnType<typeof createCounterAtom>;
