import { produce } from "immer";
import { PubSub } from "./PubSub";
import type {
  AsyncStateModifiers,
  Atom,
  AtomCreator,
  AtomCreatorPayload,
  AtomSetup,
  StateModifier,
} from "./types/atomCreator.type";
import type {
  Meta,
  MultiConsumer,
  Subscribable,
  Subscription,
} from "./types/common.type";

export function atomCreator<State, Computed, Modifiers, M = Meta, Deps = void>(
  setup: AtomSetup<State, Computed, Modifiers, M, Deps>
): AtomCreator<State, Computed, Modifiers, M, Deps> {
  return (_payload) => {
    const payload = (_payload ?? {}) as AtomCreatorPayload<State, Deps>;
    const { initState, deps } = payload;

    type ResultAtom = Atom<State, Computed, Modifiers, M>;

    const reactiveState = new ReactiveState<State>();
    const { getState, setState, asyncSetState, subscribe } = reactiveState;

    const draft = setup({
      initState,
      getState,
      setState,
      asyncSetState,
      deps: deps as Deps,
    });
    const atomPubSub = new PubSub<ResultAtom, [string | null]>();

    const atom: ResultAtom = {
      get state() {
        return getState();
      },
      toJson() {
        return atom.state;
      },
      subscribe(consumer): Subscription {
        return atomPubSub.subscribe(consumer);
      },
      meta: {} as M,
      computed: {} as never,
      modifiers: {} as never,
      ...draft,
    };

    setState(() => draft.initState);
    subscribe((memo) => atomPubSub.publish(atom, memo));

    return atom;
  };
}

class ReactiveState<State> implements Subscribable<[string | null]> {
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

  asyncSetState = async <R>(
    modifiers: AsyncStateModifiers<R, State>
  ): Promise<R> => {
    const { promise, memo: memoPrefix, started, done, failed } = modifiers;
    const memo = memoPrefix
      ? {
          started: `${memoPrefix}/started`,
          done: `${memoPrefix}/done`,
          failed: `${memoPrefix}/failed`,
        }
      : {};

    if (started) this.setState(started, memo?.started);

    try {
      const result = await promise;
      if (done) {
        this.setState((state) => done(state, result), memo?.done);
      }
      return result;
    } catch (err) {
      if (failed) {
        this.setState((state) => failed(state, err), memo?.failed);
      }
      throw err;
    }
  };

  subscribe = (subscriber: MultiConsumer<[string | null]>): Subscription => {
    return this.pubSub.subscribe(subscriber);
  };
}
