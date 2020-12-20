import { PubSub } from "./PubSub";
import {
  Consumer,
  JsonSerializable,
  StateModifier,
  Subscribable,
  Subscription,
  ToJsonOption,
} from "./types";

export abstract class Atom<State>
  implements Subscribable<Atom<State>>, JsonSerializable {
  private pubSub = new PubSub<this>();
  private _state!: State;

  constructor(state: State) {
    this.updateState(() => state);
  }

  get state(): State {
    return this._state;
  }

  protected updateState(modifier: StateModifier<State>): void {
    this._state = Object.freeze(modifier(this._state));
    this.pubSub.publish(this);
  }

  subscribe(subscriber: Consumer<this>): Subscription {
    return this.pubSub.subscribe(subscriber);
  }

  // unused parameter for override
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toJson(option?: ToJsonOption): unknown {
    return this.state;
  }
}
