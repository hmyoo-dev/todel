import type { Action, ErrorEmitter } from "./types";

export abstract class Controller {
  abstract listener(
    action: Action,
    emitError: ErrorEmitter
  ): void | Promise<void>;
}
