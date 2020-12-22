import { AnyAtom, AnyStore } from "todel";
import { ReduxDevtoolsOption } from "./types";

export function applyReduxDevtools(
  store: AnyStore,
  option: ReduxDevtoolsOption
): void {
  const devtools = window.__REDUX_DEVTOOLS_EXTENSION__?.connect(option);
  if (!devtools) return;

  const state = store.toJson();

  devtools.init(state);

  store.subscribeAction((action) => {
    devtools.send(action, store.toJson());
  });

  Object.entries(store.atoms as Record<string, AnyAtom>).forEach(
    ([key, atom]) => {
      atom.subscribe(() => {
        devtools.send({ type: `> ${key}` }, store.toJson());
      });
    }
  );
}