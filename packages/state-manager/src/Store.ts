import { Controller } from "./Controller";
import { PubSub } from "./PubSub";
import {
  Action,
  Consumer,
  JsonSerializable,
  ServiceRepo,
  StorePayload,
  StorePayloadProvider,
  ToJsonOption,
} from "./types";

export class Store<S extends ServiceRepo> implements JsonSerializable {
  private readonly _services: S;
  private readonly controllers: readonly Controller[];
  private readonly errorHandler: Consumer<unknown>;
  private readonly actionEmitter = new PubSub<Action>();

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
    this.errorHandler = errorHandler;

    this.init();
  }

  dispatch(action: Action): void {
    this.actionEmitter.publish(action);
  }

  get services(): S {
    return this._services;
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
          .map((listener) => listener(action, this.errorHandler))
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
