import { AnyStore } from "todel";

export function logStore(store: AnyStore): void {
  const servicePairs = Array.from(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Object.entries(store.services as Record<string, any>)
  );

  function getState(): Record<string, unknown> {
    return servicePairs.reduce(
      (result, [key, service]) => ({ ...result, [key]: service.toJson() }),
      {}
    );
  }

  // log when services changed
  servicePairs.forEach(([key, service]) => {
    service.subscribe(() => {
      const data = service.toJson();
      console.log(`STATE: ${key}\n`, data);
    });
  });

  // log when action dispatched
  store.subscribeAction((action) => {
    console.log(`ACTION: ${action.type}\n`, action, "\n", getState());
  });
}
