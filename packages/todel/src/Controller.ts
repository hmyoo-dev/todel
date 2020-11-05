import type { Action, ErrorEmitter } from "./types";

export interface Controller {
  listener(action: Action, emitError: ErrorEmitter): void | Promise<void>;
}
