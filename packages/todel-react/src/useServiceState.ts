import { useContext, useEffect, useState } from "react";
import { Service } from "todel";
import { StoreContext } from "./StoreContext";

export interface ServiceSelector<Repo, State> {
  (repo: Repo): Service<State>;
}

export interface StateSelector<State, Result> {
  (state: State): Result;
}

export function useServiceState<Repo, State>(
  serviceSelector: ServiceSelector<Repo, State>
): State;
export function useServiceState<Repo, State, Result>(
  serviceSelector: ServiceSelector<Repo, State>,
  stateSelector: StateSelector<State, Result>
): Result;
export function useServiceState(
  serviceSelector: ServiceSelector<unknown, unknown>,
  stateSelector: StateSelector<unknown, unknown> = (s) => s
): unknown {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("Store is not provided");
  }

  const service = serviceSelector(store.services);
  const initValue = stateSelector(service.state);

  const [value, setValue] = useState(initValue);

  useEffect(() => {
    const subscription = service.subscribe((state) => {
      const nextValue = stateSelector(state);
      setValue(nextValue);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [service, stateSelector]);

  return value;
}
