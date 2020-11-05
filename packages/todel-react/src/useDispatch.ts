import { useContext } from "react";
import { Action, Consumer } from "todel";
import { StoreContext } from "./StoreContext";

export function useDispatch(): Consumer<Action> {
  const store = useContext(StoreContext);

  if (!store) {
    throw new Error("Store is not provided");
  }

  return store.dispatch.bind(store);
}
