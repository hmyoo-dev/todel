export function shallowEqual(prev: unknown, next: unknown): boolean {
  if (prev === next) return true;

  if (!(prev instanceof Object) || !(next instanceof Object)) {
    return false;
  }

  if (Object.keys(prev).length !== Object.keys(next).length) {
    return false;
  }

  for (const [key, value] of Object.entries(prev)) {
    if (value !== (next as Record<string, unknown>)[key]) {
      return false;
    }
  }

  return true;
}
