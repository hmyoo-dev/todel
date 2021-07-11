import { useEffect, useRef, useState } from "react";
import { AnyAtom, isComputedMethod, ReadableAtom, ReadableAtoms } from "todel";
import { EqualComparator } from ".";

export function useAtomsSubscribe<R>(payload: {
  atoms: AnyAtom[];
  selector(...atoms: ReadableAtoms<AnyAtom[]>): R;
  equalityFn?: EqualComparator<R>;
}): R {
  const { atoms, selector, equalityFn = () => false } = payload;
  const readonlyAtoms = atoms.map(toReadable);

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

function toReadable<A extends AnyAtom>(atom: A): ReadableAtom<A> {
  const result: Record<string, unknown> = {
    state: atom.state,
  };

  for (const [key, val] of Object.entries(atom)) {
    if (isComputedMethod(val)) {
      result[key] = val;
    }
  }

  return result as ReadableAtom<A>;
}
