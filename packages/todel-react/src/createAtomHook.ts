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
  atomPicker: AtomPicker<A> | string
): <Result>(
  selector: AtomSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
) => OmitMethods<Result>;
export function createAtomHook<A extends AnyAtom, Result>(
  atomPicker: AtomPicker<A> | string,
  selector: AtomSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
): () => OmitMethods<Result>;

export function createAtomHook<A extends AnyAtom[]>(
  atomsPicker: AtomsPicker<A> | string[]
): <Result>(
  selector: AtomsSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
) => OmitMethods<Result>;
export function createAtomHook<A extends AnyAtom[], Result>(
  atomsPicker: AtomsPicker<A> | string[],
  selector: AtomsSelector<A, Result>,
  equalityFn?: EqualComparator<Result>
): () => OmitMethods<Result>;

export function createAtomHook(
  atomPicker: AtomsPicker<AnyAtom[]> | string | string[],
  preSelector?: AtomsSelector<AnyAtom[], unknown>,
  preEqualityFn?: EqualComparator<unknown>
): unknown {
  return (selector = preSelector!, equalityFn = preEqualityFn) => {
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
