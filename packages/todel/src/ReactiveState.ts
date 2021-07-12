import produce from "immer";
import {
  MultiConsumer,
  PubSub,
  StateModifier,
  Subscribable,
  Subscription,
} from ".";
import { AsyncSetStatePayload } from "./types/atomCreator.type";

export class ReactiveState<State> implements Subscribable<[string | null]> {
  private pubSub = new PubSub<string | null>();
  private state!: State;

  getState = (): State => {
    return this.state;
  };

  setState = (
    updater: StateModifier<State>,
    memo: string | null = null
  ): void => {
    this.state = produce(this.state, updater);
    this.pubSub.publish(memo);
  };

  asyncSetState = <Result>(
    payload: AsyncSetStatePayload<State, Result>
  ): Promise<Result> => {
    const { promise, started, done, failed, memo } = payload;
    const memos = memo
      ? {
          started: `${memo}/started`,
          done: `${memo}/done`,
          failed: `${memo}/failed`,
        }
      : {};
    if (started) {
      this.setState(started, memos.started);
    }

    return promise
      .then((result) => {
        if (done) {
          this.setState((state) => done(state, result), memos.done);
        }
        return result;
      })
      .catch((err) => {
        if (failed) {
          this.setState((state) => failed(state, err), memos.failed);
        }
        throw err;
      });
  };

  subscribe = (subscriber: MultiConsumer<[string | null]>): Subscription => {
    return this.pubSub.subscribe(subscriber);
  };
}
