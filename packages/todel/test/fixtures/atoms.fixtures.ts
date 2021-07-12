import { AsyncStatus } from "../../src";
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
  status: AsyncStatus;
  data: string | null;
  error: unknown;
}

type AjaxAtomDeps = {
  prefix?: string;
};

export const createAjaxAtom = atomCreator(
  (payload: AtomSetupPayload<AjaxAtomState, AjaxAtomDeps>) => {
    const {
      initState = { status: AsyncStatus.Idle, data: null, error: null },
      setState,
      asyncSetState,
      deps = {},
    } = payload;

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
      fetchWithNoChange: modifier((promise: Promise<string>) =>
        asyncSetState({ promise })
      ),
      fetchWithAsyncSetter: modifier((promise: Promise<string>) =>
        asyncSetState({
          promise,
          memo: deps.prefix,
          started: (state) => {
            state.status = AsyncStatus.Pending;
          },
          done: (state, data) => {
            state.status = AsyncStatus.Success;
            state.data = data;
          },
          failed: (state, err) => {
            state.status = AsyncStatus.Failed;
            state.error = err;
          },
        })
      ),
    };
  }
);
