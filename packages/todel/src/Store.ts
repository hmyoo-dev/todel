import { PubSub } from "./PubSub";
import { Action } from "./types/actionCreator.type";
import {
  ActionEffector,
  ActionErrorHandler,
  ActionHandler,
} from "./types/actionHandler.type";
import { AtomDict } from "./types/atomCreator.type";
import type {
  Consumer,
  JsonSerializable,
  Subscription,
  ToJsonOption,
} from "./types/common.type";
import { StorePayload } from "./types/store.type";

export class Store<Atoms = unknown> implements JsonSerializable {
  private readonly _atoms: Atoms;
  private readonly actionHandler: ActionHandler<Atoms>;
  private readonly errorHandler: ActionErrorHandler<Atoms>;
  private readonly actionEmitter = new PubSub<Action>();

  // If use subscribeAction() with actionEmitter,
  // dispatching in a controller may make wrong order of actions.
  // So for keeping actions order, dispatch() publish outerActionEmitter first.
  private readonly outerActionEmitter = new PubSub<Action>();

  constructor(payload: StorePayload<Atoms>) {
    const {
      atoms,
      actionHandler,
      errorHandler = defaultErrorHandler,
    } = payload;

    this._atoms = Object.freeze(atoms);
    this.actionHandler = actionHandler;
    this.errorHandler = errorHandler;

    this.init();
  }

  dispatch = (action: Action): void => {
    this.outerActionEmitter.publish(action);
    this.actionEmitter.publish(action);
  };

  get atoms(): Atoms {
    return this._atoms;
  }

  subscribeAction(subscriber: Consumer<Action>): Subscription {
    return this.outerActionEmitter.subscribe(subscriber);
  }

  toJson(option?: ToJsonOption): Record<string, unknown> {
    return toJsonAtoms((this.atoms ?? {}) as AtomDict, option);
  }

  private init(): void {
    const effector = this.createEffector();

    this.actionEmitter.subscribe((action) => {
      try {
        const result = this.actionHandler(action, this.atoms, effector);
        if (result instanceof Promise) {
          result.catch(effector.emitError);
        }
      } catch (e) {
        effector.emitError(e);
      }
    });
  }

  private createEffector(): ActionEffector {
    const effector: ActionEffector = Object.freeze({
      dispatch: this.dispatch,
      emitError: (err) => {
        this.errorHandler(err, this.atoms, effector);
      },
    });

    return effector;
  }
}

const defaultErrorHandler: ActionErrorHandler = (error) => {
  throw error;
};

function toJsonAtoms(
  atoms: AtomDict,
  option?: ToJsonOption
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  Object.entries(atoms).forEach(([key, val]) => {
    if (!val) return;

    if (typeof val.toJson === "function") {
      result[key] = val.toJson(option);
      return;
    }

    result[key] = toJsonAtoms(val as AtomDict);
  });

  return result;
}
