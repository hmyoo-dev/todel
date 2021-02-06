/*
eslint-disable
  @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-non-null-assertion
*/
import { useContext } from "react";
import { AnyAtom } from "todel";
import { StoreContext } from "./StoreContext";
import { EqualComparator, OmitMethods } from "./types";
import { useAtomsSubscribe } from "./useAtomSubscribe";

export interface AtomPicker<A extends AnyAtom> {
  (repo: any): A;
}
export interface AtomsPicker<Atoms extends AnyAtom[]> {
  (repo: any): Atoms;
}
export interface AtomSelector<A extends AnyAtom, Result> {
  (atom: A): Result;
}
export interface AtomsSelector<Atoms extends AnyAtom[], Result> {
  (...atoms: Atoms): Result;
}

export function createAtomHook<A extends AnyAtom>(
  pickAtoms: AtomPicker<A>
): <Result>(
  selector: AtomSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
) => OmitMethods<Result>;
export function createAtomHook<A extends AnyAtom, Result>(
  pickAtoms: AtomPicker<A>,
  selector: AtomSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
): () => OmitMethods<Result>;

export function createAtomHook<A extends AnyAtom[]>(
  pickAtoms: AtomsPicker<A>
): <Result>(
  selector: AtomsSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
) => OmitMethods<Result>;
export function createAtomHook<A extends AnyAtom[], Result>(
  pickAtoms: AtomsPicker<A>,
  selector: AtomsSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
): () => OmitMethods<Result>;

export function createAtomHook(
  pickAtoms: AtomsPicker<AnyAtom[]>,
  preSelector?: AtomsSelector<AnyAtom[], unknown>,
  preEqualityFn?: EqualComparator<unknown>
): unknown {
  return (selector = preSelector!, equalityFn = preEqualityFn) => {
    const store = useContext(StoreContext);

    if (!store) throw new Error("Store is not provided");

    const atoms = [pickAtoms(store.atoms)].flat();

    return useAtomsSubscribe({
      atoms,
      selector,
      equalityFn,
    });
  };
}
