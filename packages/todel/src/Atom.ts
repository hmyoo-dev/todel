import { PubSub } from "./PubSub";
import {
  Consumer,
  JsonSerializable,
  StateModifier,
  Subscribable,
  Subscription,
  ToJsonOption,
} from "./types";

export abstract class Atom<State, Computed = unknown>
  implements Subscribable<State & Computed>, JsonSerializable {
  private pubSub = new PubSub<State & Computed>();
  private _state!: State;
  private _data!: State & Computed;

  constructor(state: State) {
    this.updateState(() => state);
  }

  protected get state(): State {
    return this._state;
  }

  protected get computed(): Computed {
    return {} as Computed;
  }

  get data(): State & Computed {
    return this._data;
  }

  protected updateState(modifier: StateModifier<State>): void {
    this._state = modifier(this._state);
    this._data = Object.freeze({ ...this._state, ...this.computed });
    this.pubSub.publish(this.data);
  }

  subscribe(subscriber: Consumer<State & Computed>): Subscription {
    return this.pubSub.subscribe(subscriber);
  }

  // unused parameter for override
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toJson(option?: ToJsonOption): unknown {
    return this.state;
  }
}
