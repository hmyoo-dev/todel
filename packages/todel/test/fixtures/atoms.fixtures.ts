import { atomCreator, computed, modifier } from "../../src/atomCreator";
import { AtomSetupPayload } from "../../src/types/atomCreator.type";

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
    fetch: modifier(
      async (response: Promise<number>): Promise<number> => {
        const num = await response;
        setState(() => num);
        return num;
      }
    ),
  };
});

export type CounterAtom = ReturnType<typeof createCounterAtom>;

export interface AjaxAtomState {
  data: string | null;
}

export const createAjaxAtom = atomCreator(
  (payload: AtomSetupPayload<AjaxAtomState>) => {
    const { initState = { data: null }, setState } = payload;

    return {
      initState,
      fetch: modifier(
        (promise: Promise<string>): Promise<string> => {
          return promise.then((data) => {
            setState((state) => ({ ...state, data }));
            return data;
          });
        }
      ),
    };
  }
);
