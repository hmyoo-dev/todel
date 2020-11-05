import { createContext } from "react";
import { AnyStore } from "todel";

export const StoreContext = createContext<AnyStore | null>(null);
