"use client";

import { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Tipler
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";
import { Server } from "@/lib/types/server"; // Server tipini import ettiğinizi varsayıyorum

// Servisler
import { useProductService } from "@/lib/services/product.service";
import { useCategoryService } from "@/lib/services/category.service";
import { useServerService } from "@/lib/services/server.service";

// Context ve Bileşenler
import { WebsiteContext } from "@/lib/context/website.context";
import Header from "@/components/header";
import { TopBar } from "@/components/top-bar";

// ShadCN UI Kütüphaneleri
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";

// Lucide React Ikonları
import { 
  ArrowLeft,
  ShoppingCart,
  CreditCard,
  Package,
  Tag,
  Server as ServerIcon, // Server tipi ile çakışmaması için yeniden adlandırıldı
  PackageCheck,
  ImageIcon,
  NotebookText,
  Tags
} from "lucide-react";

// Örnek tiplerin projenizdeki tanımlarla eşleştiğinden emin olun
/*
export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string; // Category ID
  server_id: string;
  tags: string[];
  stock: number;
  createdAt: string;
  updatedAt: string;
};

export type Category = {
  id: string;
  name: string;
  image: string;
  description: string;
  server_id: string;
  createdAt: string;
  updatedAt: string;
};

export type Server = {
    id: string;
    name: string;
}
*/


export default function ProductPage({
  params,
}: {
  params: Promise<{ product_id: string }>;
}) {
  const { product_id } = use(params);

  // State'ler
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [server, setServer] = useState<Server | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Servislerin kullanımı
  const { getProductById } = useProductService(); // Kendi ürün servisiniz
  const { getCategory } = useCategoryService();
  const { getServer } = useServerService();
  const { website } = useContext(WebsiteContext);
  const router = useRouter();

  // Veri Çekme Mantığı
  useEffect(() => {
    if (!product_id) return;

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Ana ürünü çek
        const productData = await getProductById(product_id);
        setProduct(productData);

        // 2. Ürün verisiyle kategori ve sunucuyu paralel olarak çek
        const [categoryData, serverData] = await Promise.all([
            getCategory(productData.category),
            getServer(productData.server_id)
        ]);

        setCategory(categoryData);
        setServer(serverData);

      } catch (err) {
        console.error("Veri yüklenirken bir hata oluştu:", err);
        setError("Ürün, kategori veya sunucu bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [product_id]);

  // Yüklenme ve Hata durumları için arayüzler (değişiklik yok)
  if (loading) {
    return (
      <>
        <TopBar broadcastItems={website?.broadcast_items} />
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Spinner />
            <p className="text-gray-600 mt-2">Ürün detayları yükleniyor...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <TopBar broadcastItems={website?.broadcast_items} />
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-8 text-center">
              <Package className="h-16 w-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Ürün Bulunamadı</h3>
              <p className="text-red-600 mb-6">{error || "Aradığınız ürün mevcut değil veya kaldırılmış olabilir."}</p>
              <Button onClick={() => router.push("/store")} variant="destructive">
                <ArrowLeft className="h-4 w-4 mr-2" /> Mağazaya Geri Dön
              </Button>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  // Arayüz (JSX)
  return (
    <>
      <TopBar broadcastItems={website?.broadcast_items} />
      <Header />
      
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" /> Geri Dön
        </Button>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sol Taraf: Görsel ve Açıklama */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="overflow-hidden shadow-lg border-purple-100">
              <div className="aspect-video bg-gray-50 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <ImageIcon className="h-16 w-16 text-gray-300" />
                )}
              </div>
            </Card>
            
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><NotebookText className="w-6 h-6 text-purple-600"/>Ürün Açıklaması</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 leading-relaxed">{product.description || "Bu ürün için bir açıklama girilmemiş."}</p>
                    {/* Etiketler Bölümü */}
                    {product.tags && product.tags.length > 0 && (
                        <div className="mt-6">
                            <h4 className="font-semibold mb-3 flex items-center gap-2"><Tags className="w-5 h-5 text-gray-500"/>Etiketler</h4>
                            <div className="flex flex-wrap gap-2">
                                {product.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf: Satın Alma ve Bilgiler */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                <p className="text-4xl font-extrabold text-purple-600">{product.price.toFixed(2)} TRY</p>
            </div>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl border-purple-200">
              <CardHeader>
                <CardTitle>Hemen Sahip Ol</CardTitle>
                <CardDescription>Güvenli ve hızlı bir şekilde satın al.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Button size="lg" className="w-full bg-purple-600 hover:bg-purple-700"><CreditCard className="mr-2 h-5 w-5" /> Satın Al</Button>
                 <Button size="lg" variant="outline" className="w-full"><ShoppingCart className="mr-2 h-5 w-5" /> Sepete Ekle</Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
                <CardHeader><CardTitle className="text-lg">Ürün Bilgileri</CardTitle></CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2"><Tag className="w-4 h-4"/>Kategori</span>
                        <Badge variant="secondary" className="cursor-pointer" onClick={() => router.push(`/store/category/${category?.id}`)}>
                            {category?.name || "Yükleniyor..."}
                        </Badge>
                    </div>
                    <Separator/>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2"><ServerIcon className="w-4 h-4"/>Sunucu</span>
                        <span className="font-medium">{server?.name || "Yükleniyor..."}</span>
                    </div>
                    <Separator/>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-500 flex items-center gap-2"><PackageCheck className="w-4 h-4"/>Stok Durumu</span>
                        <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `${product.stock} Adet` : 'Tükendi'}
                        </span>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}