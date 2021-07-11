/*
eslint-disable
  @typescript-eslint/no-explicit-any,
*/
import { useContext } from "react";
import { AnyAtom, ReadableAtom, ReadableAtoms } from "todel";
import { StoreContext } from "./StoreContext";
import { EqualComparator } from "./types";
import { useAtomsSubscribe } from "./useAtomSubscribe";

export interface AtomPicker<A extends AnyAtom> {
  (repo: any): A;
}

export interface AtomsPicker<Arr extends AnyAtom[]> {
  (repo: any): Arr;
}

export interface AtomSelector<A extends AnyAtom, Result> {
  (atom: ReadableAtom<A>): Result;
}
export interface AtomsSelector<Atoms extends AnyAtom[], Result> {
  (...atoms: ReadableAtoms<Atoms>): Result;
}

export interface UseAtomSelector<A extends AnyAtom> {
  (): ReadableAtom<A>;
  <R>(selector: AtomSelector<A, R>, equalityFn?: EqualComparator<R>): R;
}

export function createStoreAtomHook<A extends AnyAtom>(
  atomPicker: AtomPicker<A> | string
): UseAtomSelector<A>;

export function createStoreAtomHook<A extends AnyAtom, Result>(
  atomPicker: AtomPicker<A> | string,
  selector: AtomSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
): () => Result;

export function createStoreAtomHook<A extends AnyAtom[]>(
  atomsPicker: AtomsPicker<A> | string[]
): <Result>(
  selector: AtomsSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
) => Result;
export function createStoreAtomHook<A extends AnyAtom[], Result>(
  atomsPicker: AtomsPicker<A> | string[],
  selector: AtomsSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
): () => Result;

export function createStoreAtomHook(
  atomPicker: AtomsPicker<AnyAtom[]> | string | string[],
  preSelector: AtomsSelector<AnyAtom[], unknown> = (atoms) => atoms,
  preEqualityFn?: EqualComparator<unknown>
): unknown {
  return (selector = preSelector, equalityFn = preEqualityFn) => {
    const store = useContext(StoreContext);

    if (!store) throw new Error("Store is not provided");

    const pickAtoms = toPicker(atomPicker);

    const atoms = [pickAtoms(store.atoms)].flat();

    return useAtomsSubscribe({
      atoms,
      selector,
      equalityFn,
    });
  };
}

function toPicker(
  param: AtomsPicker<AnyAtom[]> | string | string[]
): AtomsPicker<AnyAtom[]> {
  if (typeof param === "function") return param;
  if (Array.isArray(param)) return (repo: any) => param.map((key) => repo[key]);
  return (repo: any) => repo[param];
}
