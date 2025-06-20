import { ChestItem } from "./chest";
import { Product } from "./product";

export type User = {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    chest: ChestItem[];
}

