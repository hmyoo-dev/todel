import type { JsonSerializable, Meta, Subscribable } from "./common.type";

type ConditionalPartial<T, R> = Partial<T> extends T ? Partial<R> : R;
type OptionalVoid<T> = Partial<T> extends T ? void | T : T;

export interface Atom<State, Computed, Modifiers, M = Meta>
  extends JsonSerializable,
    Subscribable<[Atom<State, Computed, Modifiers, M>, string | null]> {
  state: State;
  computed: Computed;
  modifiers: Modifiers;
  meta: M;
}

export interface AtomDraft<State, Computed, Modifiers, M = Meta>
  extends Partial<JsonSerializable> {
  initState: State;
  computed?: Computed;
  modifiers?: Modifiers;
  meta?: M;
}

export interface StateModifier<State> {
  (current: State): State;
}

export interface AtomSetupPayload<State, Deps = void> {
  getState(): State;
  setState(modifier: StateModifier<State>, memo?: string): void;
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

export interface AtomDevtoolOption {
  ignoreUpdate?: boolean;
}

export interface AtomMeta {
  devtool?: AtomDevtoolOption;
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
