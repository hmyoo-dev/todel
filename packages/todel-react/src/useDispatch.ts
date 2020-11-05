import { useContext } from "react";
import { Action, Consumer } from "todel";
import { StoreContext } from "todel-react/src/StoreContext";

export function useDispatch(): Consumer<Action> {
  const store = useContext(StoreContext);

  return store.dispatch.bind(store);
}
