import { PubSub } from "./PubSub";
import type {
  Consumer,
  IService,
  StateModifier,
  Subscription,
  ToJsonOption,
} from "./types";

export abstract class Service<State> implements IService<State> {
  constructor(private _state: State) {}
  private pubSub = new PubSub<State>();

  protected updateState(modifier: StateModifier<State>): State {
    const state = (this._state = Object.freeze(modifier(this._state)));

    this.pubSub.publish(state);

    return state;
  }

  get state(): State {
    return this._state;
  }

  subscribe(subscriber: Consumer<State>): Subscription {
    return this.pubSub.subscribe(subscriber);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toJson(option?: ToJsonOption): unknown {
    return this.state;
  }
}
