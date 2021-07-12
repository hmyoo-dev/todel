import { PubSub } from "./PubSub";
import { ReactiveState } from "./ReactiveState";
import {
  Atom,
  AtomCreator,
  AtomCreatorPayload,
  AtomDraft,
  AtomKindAdder,
  AtomMethod,
  AtomMethodKind,
  AtomMethodKindChecker,
  AtomSetup,
} from "./types/atomCreator.type";
import type { Subscription } from "./types/common.type";

export function atomCreator<State, M, Deps, Draft extends AtomDraft<State, M>>(
  setup: AtomSetup<State, M, Deps, Draft>
): AtomCreator<State, M, Deps, Atom<State, M, Draft>> {
  return (_payload) => {
    const payload = (_payload ?? {}) as AtomCreatorPayload<State, Deps>;
    const { initState, deps } = payload;

    type ResultAtom = Atom<State, M, Draft>;

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
      toJson() {
        return atom.state;
      },
      get state() {
        return getState();
      },
      subscribe(consumer): Subscription {
        return atomPubSub.subscribe(consumer);
      },
      meta: {} as M,
      ...draft,
    };

    setState(() => draft.initState);
    subscribe((memo) => atomPubSub.publish(atom, memo));

    return atom;
  };
}

function addMethodKind<K extends AtomMethodKind>(kind: K): AtomKindAdder<K> {
  return <F>(func: F) => {
    const method = func as AtomMethod<K, F>;
    method.methodKind = kind;
    return method;
  };
}

function createMethodChecker<K extends AtomMethodKind>(
  kind: K
): AtomMethodKindChecker<K> {
  return <F>(func: F): func is AtomMethod<K, F> => {
    if (typeof func !== "function") return false;
    return ((func as unknown) as AtomMethod<K, F>).methodKind === kind;
  };
}

export const computed = addMethodKind(AtomMethodKind.Computed);
export const modifier = addMethodKind(AtomMethodKind.Modifier);

export const isComputedMethod = createMethodChecker(AtomMethodKind.Computed);
export const isModifierMethod = createMethodChecker(AtomMethodKind.Modifier);
