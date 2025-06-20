"use client";

import { Category } from "@/lib/types/category";
import { useCategoryService } from "@/lib/services/category.service";
import { TopBar } from "@/components/top-bar";
import Header from "@/components/header";
import { use, useContext, useEffect, useState } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { Spinner } from "@/components/ui/spinner";
import { useProductService } from "@/lib/services/product.service";
import { Product } from "@/lib/types/product";
import ProductCard from "@/components/store/ProductCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  Package2, 
  Grid3X3, 
  ArrowLeft, 
  ShoppingBag,
  Sparkles,
  Image as ImageIcon,
  Tag
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category_id: string }>;
}) {
  const { category_id } = use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getCategory } = useCategoryService();
  const { getProductsByCategory } = useProductService();
  const { website } = useContext(WebsiteContext);
  const router = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const categoryData = await getCategory(category_id);
        const productsData = await getProductsByCategory(category_id);
        
        setCategory(categoryData);
        setProducts(productsData);
      } catch (error) {
        console.error("Kategori yüklenirken hata:", error);
        setError("Kategori bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [category_id]);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Spinner />
            <p className="text-gray-600">Kategori bilgileri yükleniyor...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !category) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <Package2 className="h-16 w-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Kategori Bulunamadı
              </h3>
              <p className="text-red-600 mb-4">
                {error || "Aradığınız kategori bulunamadı veya erişilemiyor."}
              </p>
              <Button onClick={() => router.push("/store")} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Mağazaya Dön
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const totalProducts = products?.length || 0;

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/store")}
            className="mb-4 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Mağazaya Dön
          </Button>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Category Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${category.image}`}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Category Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <Tag className="h-6 w-6 text-purple-600" />
                    <h1 className="text-2xl font-bold text-gray-900">
                      {category.name}
                    </h1>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Bu kategorideki özel ürünleri keşfedin ve favori eşyalarınızı bulun
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      {totalProducts} Ürün
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Package2 className="h-5 w-5" />
                Ürünler
              </CardTitle>
              {totalProducts > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {totalProducts} mevcut
                </Badge>
              )}
            </div>
            <Separator />
          </CardHeader>
          
          <CardContent className="p-6">
            {totalProducts === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Henüz ürün bulunmuyor
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Bu kategori için henüz ürün eklenmemiş. Lütfen daha sonra tekrar kontrol edin.
                </p>
              </div>
            ) : (
              // Products Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {products?.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    item={product}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Footer Info */}
        {totalProducts > 0 && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-purple-800">
                    {category.name} Özel Koleksiyonu
                  </h3>
                </div>
                <p className="text-purple-700">
                  Bu kategoriye özel seçilmiş kaliteli ürünlerle oyun deneyiminizi bir üst seviyeye taşıyın
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}