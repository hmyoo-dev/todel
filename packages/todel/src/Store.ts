import { PubSub } from "./PubSub";
import type {
  Action,
  Consumer,
  Controller,
  JsonSerializable,
  ServiceRepo,
  StorePayload,
  StorePayloadProvider,
  Subscription,
  ToJsonOption,
} from "./types";

export class Store<S extends ServiceRepo> implements JsonSerializable {
  private readonly _services: S;
  private readonly controllers: readonly Controller[];
  private readonly errorHandler: (this: this, err: unknown) => void;
  private readonly actionEmitter = new PubSub<Action>();

  // If use subscribeAction() with actionEmitter,
  // dispatching in a controller may make wrong order of actions.
  // So for keeping actions order, dispatch() publish outerActionEmitter first.
  private readonly outerActionEmitter = new PubSub<Action>();

  constructor(payloadOrProvider: StorePayload<S> | StorePayloadProvider<S>) {
    const payload =
      typeof payloadOrProvider === "function"
        ? payloadOrProvider()
        : payloadOrProvider;

    const {
      services,
      controllers,
      errorHandler = defaultErrorHandler,
    } = payload;

    this._services = Object.freeze(services);
    this.controllers = Object.freeze(controllers);
    this.errorHandler = errorHandler.bind(this);

    this.init();
  }

  dispatch = (action: Action): void => {
    this.outerActionEmitter.publish(action);
    this.actionEmitter.publish(action);
  };

  get services(): S {
    return this._services;
  }

  subscribeAction(subscriber: Consumer<Action>): Subscription {
    return this.outerActionEmitter.subscribe(subscriber);
  }

  toJson(option?: ToJsonOption): Record<string, unknown> {
    const result: Record<string, unknown> = {};

    Object.entries(this.services).forEach(([key, service]) => {
      result[key] = service.toJson(option);
    });

    return result;
  }

  private init(): void {
    const listeners = this.controllers.map((controller) =>
      controller.listener.bind(controller)
    );

    this.actionEmitter.subscribe((action) => {
      try {
        const promiseResults = listeners
          .map((listener) =>
            listener({
              action,
              dispatch: this.dispatch,
              emitError: this.errorHandler,
            })
          )
          .filter(
            (result): result is Promise<void> => result instanceof Promise
          );

        Promise.all(promiseResults).catch(this.errorHandler);
      } catch (e) {
        this.errorHandler(e);
      }
    });
  }
}

function defaultErrorHandler(error: unknown): void {
  throw error;
}
