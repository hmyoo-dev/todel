import type { JsonSerializable, Subscribable } from "./types";

type ConditionalPartial<T, R> = Partial<T> extends T ? Partial<R> : R;
type OptionalVoid<T> = Partial<T> extends T ? void | T : T;

export interface Atom<State, Computed, Modifiers, M>
  extends JsonSerializable,
    Subscribable<Atom<State, Computed, Modifiers, M>> {
  state: State;
  computed: Computed;
  modifiers: Modifiers;
  meta: M;
}

export interface AtomDraft<State, Computed, Modifiers, M>
  extends Partial<JsonSerializable> {
  initState: State;
  computed?: Computed;
  modifiers?: Modifiers;
  meta?: M;
}

export interface StateUpdater<State> {
  (current: State): State;
}

export interface AtomSetupPayload<State, Deps = void> {
  getState(): State;
  setState(updater: StateUpdater<State>): void;
  initState?: State;
  deps: Deps;
}

export interface AtomSetup<
  State,
  Computed,
  Modifiers,
  M = unknown,
  Deps = void
> {
  (payload: AtomSetupPayload<State, Deps>): AtomDraft<
    State,
    Computed,
    Modifiers,
    M
  >;
}

export type AtomCreatorPayload<State, Deps = void> = {
  initState?: State;
} & ConditionalPartial<Deps, { deps: Deps }>;

export interface AtomCreator<State, Computed, Modifiers, M, Deps = void> {
  (payload: OptionalVoid<AtomCreatorPayload<State, Deps>>): Atom<
    State,
    Computed,
    Modifiers,
    M
  >;
}

// Utils
export type AnyAtom = Atom<unknown, unknown, unknown, unknown>;

export interface ReadonlyAtom<A extends AnyAtom> {
  state: A["state"];
  computed: A["computed"];
}
export type AtomModifiers<A extends AnyAtom> = A["modifiers"];

export type ReadonlyAtoms<A extends AnyAtom[]> = {
  [K in keyof A]: K extends number ? ReadonlyAtom<A[K]> : A[K];
};
