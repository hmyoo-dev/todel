import React, { createContext, FC, useContext } from "react";
import { AnyAtom, Func } from "todel";
import { EqualComparator } from "./types";
import { useAtomsSubscribe } from "./useAtomSubscribe";
import { shallowEqual } from "./utils";

type LocalAtomProvider<A extends AnyAtom> = FC<{ atom: A }>;

type UseLocalAtom<A extends AnyAtom> = <R = A>(
  selector?: Func<A, R>,
  equalityFn?: EqualComparator<R>
) => R;

export interface LocalAtomContext<A extends AnyAtom> {
  Provider: LocalAtomProvider<A>;
  useLocalAtom: UseLocalAtom<A>;
}

export function createLocalAtomContext<A extends AnyAtom>(): LocalAtomContext<
  A
> {
  const Context = createContext<A | null>(null);

  const Provider: LocalAtomProvider<A> = ({ atom, children }) => (
    <Context.Provider value={atom}>{children}</Context.Provider>
  );

  const useLocalAtom: UseLocalAtom<A> = (
    selector = (atom: A) => atom as never,
    equalityFn = shallowEqual
  ) => {
    const contextAtom = useContext(Context);
    if (!contextAtom) throw new Error("Local atom is not provided");

    return useAtomsSubscribe({
      atoms: [contextAtom],
      selector: (atom) => selector(atom as A),
      equalityFn,
    });
  };

  return { Provider, useLocalAtom };
}
