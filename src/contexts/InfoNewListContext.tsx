import { createContext, useContext, useState } from "react";

//Context for list name and description when creating a new list
interface InfoNewListContextType {
  listName: string;
  setListName: React.Dispatch<React.SetStateAction<string>>;
  listDescription: string;
  setListDescription: React.Dispatch<React.SetStateAction<string>>;
}

const InfoNewListContext = createContext<InfoNewListContextType | null>(null);

export function InfoNewListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [listName, setListName] = useState<string>("");
  const [listDescription, setListDescription] = useState<string>("");

  return (
    <InfoNewListContext.Provider
      value={{ listName, setListName, listDescription, setListDescription }}
    >
      {children}
    </InfoNewListContext.Provider>
  );
}

export function useInfoNewList() {
  const context = useContext(InfoNewListContext);
  if (!context) {
    throw new Error("useInfoNewList must be used inside InfoNewListProvider");
  }
  return context;
}
