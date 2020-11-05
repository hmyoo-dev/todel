import React, { FC } from "react";
import { AnyStore } from "todel";
import { StoreContext } from "./StoreContext";

export interface StoreProviderProps {
  store: AnyStore;
}

export const StoreProvider: FC<StoreProviderProps> = ({ store, children }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
);
