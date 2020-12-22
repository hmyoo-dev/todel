import { Consumer } from "todel";

export interface ReduxAction {
  type: string;
}

export interface ReduxDevtoolsOption {
  name: string;
}

export interface ReduxDevtoolsMessageListener {
  (message: unknown): void;
}
export interface ReduxDevtools {
  init(state: unknown): void;
  send(action: ReduxAction, state?: unknown): void;
  error(message: string): void;
  subscribe(listener: ReduxDevtoolsMessageListener): Consumer<void>;
  unsubscribe(): void;
}

export interface ReduxDevtoolsConnector {
  connect(option: ReduxDevtoolsOption): ReduxDevtools;
}

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: ReduxDevtoolsConnector;
  }
}
