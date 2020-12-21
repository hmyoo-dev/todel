import { useContext, useEffect, useRef, useState } from "react";
import { AnyAtom, Atom } from "todel";
import { StoreContext } from "./StoreContext";
import {
  EqualComparator,
  SingleAtomSelector,
  SingleDataSelector,
  UseDataHook,
  ValueSelector,
} from "./types";

export function createDataHook<Repo, State>(
  atomSelector: SingleAtomSelector<Repo, Atom<State>>
): UseDataHook<State>;

export function createDataHook<Repo, Data, A extends AnyAtom>(
  atomSelector: SingleAtomSelector<Repo, A>,
  dataSelector: SingleDataSelector<A, Data>
): UseDataHook<Data>;

export function createDataHook<State, Data>(
  atomSelector: SingleAtomSelector<unknown, Atom<State>>,
  dataSelector: SingleDataSelector<Atom<State>, Data> = (atom) =>
    atom.state as never
): UseDataHook<Data> {
  return <Value>(
    selector: ValueSelector<Data, Value> = (data) => data as never,
    equalityFn: EqualComparator<Value> = (prev, next) => prev === next
  ): Value => {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("Store is not provided");
    }

    const atom = atomSelector(store.atoms);
    const initData = dataSelector(atom);
    const initValue = selector(initData);

    const [value, setValue] = useState(initValue);

    const cachedValue = useRef(value);
    cachedValue.current = value;

    useEffect(() => {
      const subscription = atom.subscribe((atom) => {
        const data = dataSelector(atom);
        const nextValue = selector(data);
        if (equalityFn(cachedValue.current, nextValue)) {
          return;
        }
        setValue(nextValue);
      });

      return () => {
        subscription.unsubscribe();
      };
    }, [atom]);

    return value;
  };
}
