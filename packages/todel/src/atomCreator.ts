import type {
  Atom,
  AtomCreator,
  AtomCreatorPayload,
  AtomSetup,
  StateUpdater,
} from "./atomCreator.type";
import { PubSub } from "./PubSub";
import type { Consumer, Subscribable, Subscription } from "./types";

export function atomCreator<
  State,
  Computed,
  Modifiers,
  M = unknown,
  Deps = void
>(
  setup: AtomSetup<State, Computed, Modifiers, M, Deps>
): AtomCreator<State, Computed, Modifiers, M, Deps> {
  return (_payload) => {
    const payload = (_payload ?? {}) as AtomCreatorPayload<State, Deps>;
    const { initState, deps } = payload;

    type ResultAtom = Atom<State, Computed, Modifiers, M>;

    const { getState, setState, subscribe } = new ReactiveState<State>();
    const draft = setup({ initState, getState, setState, deps: deps as Deps });
    const atomPubSub = new PubSub<ResultAtom>();

    setState(() => draft.initState);

    const atom: ResultAtom = {
      get state() {
        return getState();
      },
      toJson() {
        return this.state;
      },
      subscribe(consumer: Consumer<ResultAtom>): Subscription {
        return atomPubSub.subscribe(consumer);
      },
      meta: {} as M,
      computed: {} as never,
      modifiers: {} as never,
      ...draft,
    };

    subscribe(() => atomPubSub.publish(atom));
    return atom;
  };
}

class ReactiveState<State> implements Subscribable<void> {
  private pubSub = new PubSub<void>();
  private state!: State;

  getState = (): State => {
    return this.state;
  };

  setState = (updater: StateUpdater<State>): void => {
    this.state = updater(this.state);
    this.pubSub.publish();
  };

  subscribe = (subscriber: Consumer<void>): Subscription => {
    return this.pubSub.subscribe(subscriber);
  };
}
