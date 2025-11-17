import { createContext, useContext, useState } from "react";

interface SelectedItemsContextType {
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
}

const SelectedItemsContext = createContext<SelectedItemsContextType | null>(
  null
);

export function SelectedItemsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

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
