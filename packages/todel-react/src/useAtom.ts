import { useContext, useEffect, useRef, useState } from "react";
import { Atom } from "todel";
import { StoreContext } from "./StoreContext";
import { shallowEqual } from "./utils";

export interface LegacyAtomSelector<Repo, State, Computed> {
  (repo: Repo): Atom<State, Computed>;
}

export interface LegacyDataSelector<Result, State, Computed = unknown> {
  (data: State & Computed): Result;
}

export function useAtom<Repo, State, Computed = unknown>(
  atomSelector: LegacyAtomSelector<Repo, State, Computed>
): State;
export function useAtom<Repo, Result, State, Computed = unknown>(
  atomSelector: LegacyAtomSelector<Repo, State, Computed>,
  dataSelector: LegacyDataSelector<Result, State, Computed>,
  equalityFn?: (prev: Result, next: Result) => boolean
): Result;
export function useAtom(
  atomSelector: LegacyAtomSelector<unknown, unknown, unknown>,
  dataSelector: LegacyDataSelector<unknown, unknown> = (s) => s,
  equalityFn: (prev: unknown, next: unknown) => boolean = shallowEqual
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
    const subscription = atom.subscribe((atom) => {
      const nextValue = dataSelector(atom.data);
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
