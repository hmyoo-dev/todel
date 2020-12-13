import { AtomSelector, DataSelector, useAtom } from "./useAtom";
import { shallowEqual } from "./utils";

export interface UseSelectedAtom<State, Computed> {
  (): State & Computed;
  <Result>(
    dataSelector: DataSelector<Result, State, Computed>,
    equalityFn?: (prev: Result, next: Result) => boolean
  ): Result;
}

export function createAtomSelector<Repo, State, Computed>(
  selector: AtomSelector<Repo, State, Computed>
): UseSelectedAtom<State, Computed> {
  return <R>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataSelector = (data: State & Computed) => data as any,
    equalityFn = shallowEqual
  ): R => {
    return useAtom(selector, dataSelector, equalityFn);
  };
}
