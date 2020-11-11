import { useContext, useEffect, useRef, useState } from "react";
import { IService } from "todel";
import { StoreContext } from "./StoreContext";

export interface ServiceSelector<Repo, State> {
  (repo: Repo): IService<State>;
}

export interface StateSelector<State, Result> {
  (state: State): Result;
}

export function useServiceState<Repo, State>(
  serviceSelector: ServiceSelector<Repo, State>
): State;
export function useServiceState<Repo, State, Result>(
  serviceSelector: ServiceSelector<Repo, State>,
  stateSelector: StateSelector<State, Result>,
  equalityFn?: (prev: Result, next: Result) => boolean
): Result;
export function useServiceState(
  serviceSelector: ServiceSelector<unknown, unknown>,
  stateSelector: StateSelector<unknown, unknown> = (s) => s,
  equalityFn: (prev: unknown, next: unknown) => boolean = (p, n) => p === n
): unknown {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("Store is not provided");
  }

  const service = serviceSelector(store.services);
  const initValue = stateSelector(service.state);

  const [value, setValue] = useState(initValue);
  const cachedValue = useRef(value);
  cachedValue.current = value;

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      const nextValue = stateSelector(state);
      if (!equalityFn(cachedValue.current, nextValue)) {
        setValue(nextValue);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [service]);

  return value;
}
