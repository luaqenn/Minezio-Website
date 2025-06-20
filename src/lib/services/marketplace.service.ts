import { useApi } from "@/lib/hooks/useApi";
import { BACKEND_URL_WITH_WEBSITE_ID } from "../constants/base";
import { User } from "../types/user";
import { Category } from "../types/category";
import { Product } from "../types/product";

export const useMarketplaceService = () => {
  const { post, get } = useApi({ baseUrl: BACKEND_URL_WITH_WEBSITE_ID });

  const purchaseProduct = async (
    product_id: string
  ): Promise<{ success: string; message: string; type: string }> => {
    const response = await post<{
      success: string;
      message: string;
      type: string;
    }>(`/marketplace/purchase`, { productId: product_id }, {}, true);
    return response.data;
  };

  return {
    purchaseProduct,
  };
};
