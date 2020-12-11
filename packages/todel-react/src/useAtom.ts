import { useContext, useEffect, useRef, useState } from "react";
import { Atom } from "todel";
import { StoreContext } from "./StoreContext";

export interface AtomSelector<Repo, State, Computed> {
  (repo: Repo): Atom<State, Computed>;
}

export interface DataSelector<Result, State, Computed = unknown> {
  (data: State & Computed): Result;
}

export function useAtom<Repo, State, Computed = unknown>(
  atomSelector: AtomSelector<Repo, State, Computed>
): State;
export function useAtom<Repo, Result, State, Computed = unknown>(
  atomSelector: AtomSelector<Repo, State, Computed>,
  dataSelector: DataSelector<Result, State, Computed>,
  equalityFn?: (prev: Result, next: Result) => boolean
): Result;
export function useAtom(
  atomSelector: AtomSelector<unknown, unknown, unknown>,
  dataSelector: DataSelector<unknown, unknown> = (s) => s,
  equalityFn: (prev: unknown, next: unknown) => boolean = (p, n) => p === n
): unknown {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("Store is not provided");
  }

  const atom = atomSelector(store.atoms);
  const initValue = dataSelector(atom.data);

  const [value, setValue] = useState(initValue);
  const cachedValue = useRef(value);
  cachedValue.current = value;

  useEffect(() => {
    const subscription = atom.subscribe((data) => {
      const nextValue = dataSelector(data);
      if (!equalityFn(cachedValue.current, nextValue)) {
        setValue(nextValue);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [atom]);

  return value;
}
