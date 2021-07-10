import { actionCreator } from "../../src/actionCreators";

export const increase = actionCreator("increase");
export const decrease = actionCreator("decrease");
export const triggerDecrease = actionCreator("triggerDecrease");
export const throwError = actionCreator("throwError");
export const throwAsyncError = actionCreator("throwAsyncError");
export const emitErr = actionCreator("emitError");
export const reset = actionCreator("reset");
