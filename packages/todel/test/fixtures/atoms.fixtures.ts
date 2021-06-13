import { atomCreator } from "../../src/atomCreator";
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
    computed: {
      getDoubled(): number {
        return getState() * 2;
      },
    },
    modifiers: {
      increase(): void {
        setState((state) => (state += step));
      },
      decrease(): void {
        setState((state) => state - step);
      },
    },
  };
});

export type CounterAtom = ReturnType<typeof createCounterAtom>;

export enum AjaxStatus {
  Idle = "idle",
  Pending = "pending",
  Done = "done",
  Failed = "failed",
}
export interface AjaxAtomState {
  status: AjaxStatus;
  data: string | null;
  err: unknown | null;
}

export type AjaxAtomSetupPayload = AtomSetupPayload<AjaxAtomState>;

export const createAjaxAtom = atomCreator((payload: AjaxAtomSetupPayload) => {
  const {
    initState = { status: AjaxStatus.Idle, data: null, err: null },
    asyncSetState,
  } = payload;

  return {
    initState,
    modifiers: {
      fetch(promise: Promise<string>, memo?: string): Promise<string> {
        return asyncSetState({
          promise,
          memo,
          started: (state) => {
            state.status = AjaxStatus.Pending;
          },
          done: (state, result) => {
            state.status = AjaxStatus.Done;
            state.data = result;
          },
          failed: (state, err) => {
            state.status = AjaxStatus.Failed;
            state.err = err;
          },
        });
      },
      nothing(promise: Promise<string>): Promise<string> {
        return asyncSetState({ promise });
      },
    },
  };
});
