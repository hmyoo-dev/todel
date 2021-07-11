import React, { createContext, FC, useContext } from "react";
import {
  AnyAtom,
  Func,
  isModifierMethod,
  ReadableAtom,
  WritableAtom,
} from "todel";
import { EqualComparator } from "./types";
import { useAtomsSubscribe } from "./useAtomSubscribe";
import { shallowEqual } from "./utils";

type LocalAtomProvider<A extends AnyAtom> = FC<{ atom: A }>;
export interface UseLocalAtomData<A extends AnyAtom> {
  (): ReadableAtom<A>;
  <R>(selector: Func<ReadableAtom<A>, R>, equalityFn?: EqualComparator<R>): R;
}

export interface UseLocalAtomModifiers<A extends AnyAtom> {
  (): WritableAtom<A>;
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
    const modifiers: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(contextAtom)) {
      if (isModifierMethod(val)) {
        modifiers[key] = val;
      }
    }
    return modifiers as WritableAtom<A>;
  };

  return { Provider, useLocalAtomData, useLocalAtomModifiers };
}
