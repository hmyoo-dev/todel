import {
  AjaxAtom,
  AjaxAtomState,
  AjaxStatus,
  idleAjaxAtomState,
} from "../../src/AjaxAtom";

export interface Author {
  name: string;
}

export type AuthorAtomState = AjaxAtomState<Author | null>;

export class AuthorAtom extends AjaxAtom<Author | null> {
  static idle(): AuthorAtom {
    return new AuthorAtom(idleAjaxAtomState(null));
  }

  static pending(): AuthorAtom {
    return new AuthorAtom({
      ...idleAjaxAtomState(null),
      status: AjaxStatus.Pending,
    });
  }

  static done(author: Author): AuthorAtom {
    return new AuthorAtom({
      value: author,
      status: AjaxStatus.Success,
      error: null,
    });
  }

  static failed(): AuthorAtom {
    return new AuthorAtom({
      value: null,
      status: AjaxStatus.Failure,
      error: new Error("Failed"),
    });
  }

  get defaultValue(): Author | null {
    return null;
  }
}
