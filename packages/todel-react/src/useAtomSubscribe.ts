import { useEffect, useRef, useState } from "react";
import { AnyAtom } from "todel";
import { EqualComparator } from ".";

export function useAtomsSubscribe<R>(payload: {
  atoms: AnyAtom[];
  selector(...atoms: AnyAtom[]): R;
  equalityFn?: EqualComparator<R>;
}): R {
  const { atoms, selector, equalityFn = () => false } = payload;

  const initValue = selector(...atoms);
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
