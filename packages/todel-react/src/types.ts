/*
eslint-disable
  @typescript-eslint/ban-types,
*/
import { AnyAtom } from "todel";

export interface SingleAtomSelector<Repo, A extends AnyAtom> {
  (repo: Repo): A;
}

export interface MultiAtomSelector<Repo, Atoms> {
  (repo: Repo): Atoms;
}

export interface SingleDataSelector<A extends AnyAtom, Data> {
  (atom: A): Data;
}

export interface MultiDataSelector<Atoms, Data> {
  (atoms: Atoms): Data;
}

export interface ValueSelector<Data, Value> {
  (data: Data): Value;
}

export interface EqualComparator<V> {
  (prev: V, next: V): boolean;
}

export type OmitMethods<T> = {
  [key in keyof T]: T[key] extends Function ? never : T[key];
};
