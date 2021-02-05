/*
eslint-disable
  @typescript-eslint/ban-types,
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-non-null-assertion
*/
import { useContext } from "react";
import { AnyAtom } from "todel";
import { StoreContext } from "./StoreContext";
import { EqualComparator } from "./types";
import { useAtomsSubscribe } from "./useAtomSubscribe";

export interface UseAtomsOptions<A extends AnyAtom[], Result> {
  selector(...atoms: A): Result;
  equalityFn: EqualComparator<Result>;
}

export interface AtomsPicker<Atoms extends AnyAtom[]> {
  (repo: any): Atoms;
}
export interface AtomsSelector<Atoms extends AnyAtom[], Result> {
  (...atoms: Atoms): Result;
}

type OmitMethods<T> = {
  [key in keyof T]: T[key] extends Function ? never : T[key];
};

export function createAtomsHook<A extends AnyAtom[]>(
  pickAtoms: AtomsPicker<A>
): <Result>(
  selector: AtomsSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
) => OmitMethods<Result>;
export function createAtomsHook<A extends AnyAtom[], Result>(
  pickAtoms: AtomsPicker<A>,
  selector: AtomsSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
): () => OmitMethods<Result>;

export function createAtomsHook(
  pickAtoms: AtomsPicker<AnyAtom[]>,
  preSelector?: AtomsSelector<AnyAtom[], unknown>,
  preEqualityFn?: EqualComparator<unknown>
): unknown {
  return (selector = preSelector!, equalityFn = preEqualityFn) => {
    const store = useContext(StoreContext);

    if (!store) throw new Error("Store is not provided");

    const atoms = pickAtoms(store.atoms);

    return useAtomsSubscribe({
      atoms,
      selector,
      equalityFn,
    });
  };
}
