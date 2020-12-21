import { useContext, useEffect, useRef, useState } from "react";
import { AnyAtom } from "todel";
import { StoreContext } from "./StoreContext";
import {
  EqualComparator,
  MultiAtomSelector,
  MultiDataSelector,
  UseDataHook,
  ValueSelector,
} from "./types";

export function createJoinDataHook<Repo, Data, Atoms extends AnyAtom[]>(
  atomsSelector: MultiAtomSelector<Repo, [...Atoms]>,
  dataSelector: MultiDataSelector<Atoms, Data>
): UseDataHook<Data> {
  return <Value>(
    selector: ValueSelector<Data, Value> = (data) => data as never,
    equalityFn: EqualComparator<Value> = (prev, next) => prev === next
  ): Value => {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("Store is not provided");
    }

    const atoms = atomsSelector(store.atoms as Repo);
    const initData = dataSelector(atoms);
    const initValue = selector(initData);

    const [value, setValue] = useState(initValue);

    const cachedValue = useRef(value);
    cachedValue.current = value;

    useEffect(() => {
      const subscriptions = atoms.map((atom) =>
        atom.subscribe(() => {
          const data = dataSelector(atoms);
          const nextValue = selector(data);
          if (equalityFn(cachedValue.current, nextValue)) {
            return;
          }
          setValue(nextValue);
        })
      );

      return () => {
        subscriptions.forEach((sub) => sub.unsubscribe());
      };
    }, atoms);

    return value;
  };
}
