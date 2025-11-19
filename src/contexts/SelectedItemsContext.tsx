import { createContext, useContext, useState } from "react";
import { Item } from "../models/Item";

interface SelectedItemsContextType {
  selectedItems: Item[];
  setSelectedItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const SelectedItemsContext = createContext<SelectedItemsContextType | null>(
  null
);

export function SelectedItemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  return (
    <SelectedItemsContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </SelectedItemsContext.Provider>
  );
}

export function useSelectedItems() {
  const context = useContext(SelectedItemsContext);
  if (!context) {
    throw new Error(
      "useSelectedItems must be used inside SelectedItemsProvider"
    );
  }
  return context;
}
