export interface Website {
  id: string;
  name: string;
  description: string;
  url: string;
  favicon: string;
  image: string;
  keywords: string[];
  sliders: {
    id: string;
    image: string;
    text: string;
    description: string;
    buttonText: string;
    route: string;
  }[];
  currency: string;
  discord: {
    webhook_url: string;
    guild_id: string;
  };
  users: {
    id: string;
    name: string;
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
  google_analytics: {
    gaId: string;
  };
  broadcast_items: string[];
  createdAt: string;
  updatedAt: string;
}
