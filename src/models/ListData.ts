import { ListItem } from "./ListItem";

export type ListData = {
    name: string;
    description: string;
    items: ListItem[];
    totalItems: number;
    completedItems: number;
    createdAt: Date;
    updatedAt: Date;
}
