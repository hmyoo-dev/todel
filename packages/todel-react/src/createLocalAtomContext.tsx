import React, { createContext, FC, useContext } from "react";
import { AnyAtom, AtomModifiers, Func, ReadonlyAtom } from "todel";
import { EqualComparator } from "./types";
import { useAtomsSubscribe } from "./useAtomSubscribe";
import { shallowEqual } from "./utils";

type LocalAtomProvider<A extends AnyAtom> = FC<{ atom: A }>;
export interface UseLocalAtomData<A extends AnyAtom> {
  (): ReadonlyAtom<A>;
  <R>(selector: Func<ReadonlyAtom<A>, R>, equalityFn?: EqualComparator<R>): R;
}

export interface UseLocalAtomModifiers<A extends AnyAtom> {
  (): AtomModifiers<A>;
}

export interface LocalAtomContext<A extends AnyAtom> {
  Provider: LocalAtomProvider<A>;
  useLocalAtomData: UseLocalAtomData<A>;
  useLocalAtomModifiers: UseLocalAtomModifiers<A>;
}

export function createLocalAtomContext<A extends AnyAtom>(): LocalAtomContext<
  A
> {
  const Context = createContext<A | null>(null);

  const Provider: LocalAtomProvider<A> = ({ atom, children }) => (
    <Context.Provider value={atom}>{children}</Context.Provider>
  );

  function useAtomContext(): A {
    const contextAtom = useContext(Context);
    if (!contextAtom) throw new Error("Local atom is not provided");
    return contextAtom;
  }

  const useLocalAtomData: UseLocalAtomData<A> = (
    selector = (atom: A) => atom,
    equalityFn = shallowEqual
  ) => {
    const contextAtom = useAtomContext();

    return useAtomsSubscribe({
      atoms: [contextAtom],
      selector: (atom) => selector(atom as A),
      equalityFn,
    });
  };

  const useLocalAtomModifiers: UseLocalAtomModifiers<A> = () => {
    const contextAtom = useAtomContext();
    return contextAtom.modifiers;
  };

  return { Provider, useLocalAtomData, useLocalAtomModifiers };
}
