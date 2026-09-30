"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import CommandPalette from "./CommandPalette";

const SearchCtx = createContext<() => void>(() => {});
export const useSearch = () => useContext(SearchCtx);

/** Shared navbar + ⌘K palette for every page. */
export default function Chrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <SearchCtx.Provider value={() => setOpen(true)}>
      <Navbar onSearch={() => setOpen(true)} />
      {children}
      <CommandPalette open={open} setOpen={setOpen} />
    </SearchCtx.Provider>
  );
}
