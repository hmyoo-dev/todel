import { combineActionHandlers } from "./actionHandlerHelpers";
import { PubSub } from "./PubSub";
import type {
  Action,
  ActionEffector,
  ActionHandler,
  Consumer,
  JsonSerializable,
  StorePayload,
  StorePayloadProvider,
  Subscription,
  ToJsonOption,
} from "./types";

type PayloadOrProvider<S> = StorePayload<S> | StorePayloadProvider<S>;
export class Store<S = unknown> implements JsonSerializable {
  private readonly _atoms: S;
  private readonly actionHandlers: readonly ActionHandler[];
  private readonly errorHandler: (this: this, err: unknown) => void;
  private readonly actionEmitter = new PubSub<Action>();

  // If use subscribeAction() with actionEmitter,
  // dispatching in a controller may make wrong order of actions.
  // So for keeping actions order, dispatch() publish outerActionEmitter first.
  private readonly outerActionEmitter = new PubSub<Action>();

  constructor(payloadOrProvider: PayloadOrProvider<S>) {
    const payload = getPayload(payloadOrProvider);

    const {
      atoms,
      actionHandlers,
      errorHandler = defaultErrorHandler,
    } = payload;

    this._atoms = Object.freeze(atoms);
    this.actionHandlers = Object.freeze(actionHandlers);
    this.errorHandler = errorHandler.bind(this);

    this.init();
  }

  dispatch = (action: Action): void => {
    this.outerActionEmitter.publish(action);
    this.actionEmitter.publish(action);
  };

  get atoms(): S {
    return this._atoms;
  }

  subscribeAction(subscriber: Consumer<Action>): Subscription {
    return this.outerActionEmitter.subscribe(subscriber);
  }

  toJson(option?: ToJsonOption): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    // TODO: atoms is recursive.
    Object.entries(this.atoms).forEach(([key, atom]) => {
      result[key] = atom.toJson(option);
    });

    return result;
  }

  private init(): void {
    const combinedHandler = combineActionHandlers(this.actionHandlers);
    const effector: ActionEffector = Object.freeze({
      dispatch: this.dispatch,
      emitError: this.errorHandler,
    });

    this.actionEmitter.subscribe((action) => {
      try {
        combinedHandler(action, effector).catch(this.errorHandler);
      } catch (e) {
        this.errorHandler(e);
      }
    });
  }
}

function defaultErrorHandler(error: unknown): void {
  throw error;
}

function getPayload<S>(
  payloadOrProvider: PayloadOrProvider<S>
): StorePayload<S> {
  if (typeof payloadOrProvider === "function") return payloadOrProvider();
  return payloadOrProvider;
}
