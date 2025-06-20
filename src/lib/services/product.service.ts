import { useApi } from "@/lib/hooks/useApi";
import { BACKEND_URL_WITH_WEBSITE_ID } from "../constants/base";
import { User } from "../types/user";
import { Category } from "../types/category";
import { Product } from "../types/product";

export const useProductService = () => {
  const { post, get } = useApi({ baseUrl: BACKEND_URL_WITH_WEBSITE_ID });

  const getProductsByCategory = async (
    category_id: string
  ): Promise<Product[]> => {
    const response = await get<Product[]>(
      `/products/by-category/${category_id}`,
      {},
      true
    );
    return response.data;
  };

  const getProductById = async (product_id: string): Promise<Product> => {
    const response = await get<Product>(`/products/${product_id}`, {}, true);
    return response.data;
  };

  return {
    getProductsByCategory,
    getProductById,
  };
};
