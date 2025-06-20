export interface Website {
    id: string;
    name: string;
    description: string;
    url: string;
    image: string;
    currency: string;
    discord: {
        id: string;
        name: string;
        avatar: string;
    };
    users: {
        id: string;
        name: string;
        avatar: string;
    }[];
    roles: {
        id: string;
        name: string;
    }[];
    products: {
        id: string;
        name: string;
        price: number;
        description: string;
        image: string;
    }[];
    license_key: string;
    categories: {
        id: string;
        name: string;
    }[];
    broadcast_items: string[];
    createdAt: string;
    updatedAt: string;
}