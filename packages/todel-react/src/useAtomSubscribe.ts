import { useEffect, useRef, useState } from "react";
import { AnyAtom, ReadonlyAtom, ReadonlyAtoms } from "todel";
import { EqualComparator } from ".";

export function useAtomsSubscribe<R>(payload: {
  atoms: AnyAtom[];
  selector(...atoms: ReadonlyAtoms<AnyAtom[]>): R;
  equalityFn?: EqualComparator<R>;
}): R {
  const { atoms, selector, equalityFn = () => false } = payload;
  const readonlyAtoms = atoms.map(
    (atom): ReadonlyAtom<AnyAtom> => ({
      state: atom.state,
      computed: atom.computed,
    })
  );

  const initValue = selector(...readonlyAtoms);
  const [, setRevision] = useState(0);
  const [value, setValue] = useState(initValue);
  const cachedValue = useRef(value);
  cachedValue.current = value;

  useEffect(() => {
    const subscriptions = atoms.map((atom) =>
      atom.subscribe(() => {
        const nextValue = selector(...atoms);
        if (equalityFn(cachedValue.current, nextValue)) {
          return;
        }
        setRevision((val) => val + 1);
        setValue(nextValue);
      })
    );

    return () => {
      subscriptions.forEach((sub) => sub.unsubscribe());
    };
  }, atoms);

  return value;
}
