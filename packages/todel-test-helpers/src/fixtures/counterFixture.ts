import {
  actionCreator,
  atomCreator,
  AtomSetupPayload,
  computed,
  modifier,
} from "todel";

export const increase = actionCreator("increase");
export const setCount = actionCreator<number>("setCount");

export interface CounterDeps {
  step?: number;
}

export type CounterSetupPayload = AtomSetupPayload<number, CounterDeps | void>;

export const createCounterAtom = atomCreator((payload: CounterSetupPayload) => {
  const { initState = 0, getState, setState, deps = {} } = payload;
  const { step = 1 } = deps;

  return {
    initState,
    isGreaterThen: computed((num: number) => getState() > num),
    increase: modifier(() => setState((state) => state + step)),
    decrease: modifier(() => setState((state) => state - step)),
    setCount: modifier((count: number) => setState(() => count)),
    fetch: modifier(
      async (response: Promise<number>): Promise<number> => {
        const num = await response;
        setState(() => num);
        return num;
      }
    ),
  };
});

const counter = createCounterAtom();

export type CounterAtom = ReturnType<typeof createCounterAtom>;
