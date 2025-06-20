"use client";

import { Category } from "@/lib/types/category";
import { useCategoryService } from "@/lib/services/category.service";
import { useContext, useEffect, useState, use } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { Spinner } from "@/components/ui/spinner";
import { useServerService } from "@/lib/services/server.service";
import { Server } from "@/lib/types/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/store/CategoryCard";
import { 
  Server as ServerIcon, 
  Grid3X3, 
  ArrowLeft, 
  Package,
  Sparkles,
  Image as ImageIcon
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ServerPage({
  params,
}: {
  params: Promise<{ server_id: string }>;
}) {
  // React.use() ile params'ı unwrap ediyoruz
  const { server_id } = use(params);
  const [server, setServer] = useState<Server | null>(null);
  const [serverCategories, setServerCategories] = useState<Category[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getServer } = useServerService();
  const { getCategories } = useCategoryService();
  const { website } = useContext(WebsiteContext);
  const router = useRouter();

  useEffect(() => {
    const fetchServer = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const serverData = await getServer(server_id);
        const allCategories = await getCategories();
        const filteredCategories = allCategories.filter(
          (category) => category.server_id === serverData.id
        );
        
        setServerCategories(filteredCategories);
        setServer(serverData);
      } catch (error) {
        console.error("Server yüklenirken hata:", error);
        setError("Sunucu bilgileri yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchServer();
  }, [server_id]);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Spinner />
            <p className="text-gray-600">Sunucu bilgileri yükleniyor...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !server) {
    return (
      <>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <ServerIcon className="h-16 w-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Sunucu Bulunamadı
              </h3>
              <p className="text-red-600 mb-4">
                {error || "Aradığınız sunucu bulunamadı veya erişilemiyor."}
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

  const totalCategories = serverCategories?.length || 0;

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

        {/* Server Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Server Image */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center overflow-hidden">
                    {server.image ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${server.image}`}
                        alt={server.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                </div>
                
                {/* Server Info */}
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <ServerIcon className="h-6 w-6 text-blue-600" />
                    <h1 className="text-2xl font-bold text-gray-900">
                      {server.name}
                    </h1>
                  </div>
                  <p className="text-gray-600 mb-3">
                    Bu sunucuya ait kategorileri keşfedin ve eşyalarınızı seçin
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Grid3X3 className="h-3 w-3 mr-1" />
                      {totalCategories} Kategori
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Kategoriler
              </CardTitle>
              {totalCategories > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {totalCategories} aktif
                </Badge>
              )}
            </div>
            <Separator />
          </CardHeader>
          
          <CardContent className="p-6">
            {totalCategories === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <Grid3X3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Henüz kategori bulunmuyor
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Bu sunucu için henüz kategori eklenmemiş. Lütfen daha sonra tekrar kontrol edin.
                </p>
              </div>
            ) : (
              // Categories Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {serverCategories?.map((category: Category) => (
                  <CategoryCard
                    key={category.id}
                    category={{
                      id: category.id,
                      name: category.name,
                      image: category.image || "/images/default-category.png",
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Footer Info */}
        {totalCategories > 0 && (
          <div className="mt-8">
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">
                    {server.name} Özel Koleksiyonu
                  </h3>
                </div>
                <p className="text-green-700">
                  Bu sunucuya özel tasarlanmış eşyalar ve kategorilerle oyun deneyiminizi zenginleştirin
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}