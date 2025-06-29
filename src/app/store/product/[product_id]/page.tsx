"use client";

import { use, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Tipler
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";
import { Server } from "@/lib/types/server";

// Servisler
import { useProductService } from "@/lib/services/product.service";
import { useCategoryService } from "@/lib/services/category.service";
import { useServerService } from "@/lib/services/server.service";
import { useMarketplaceService } from "@/lib/services/marketplace.service";

// Context ve Bileşenler
import { WebsiteContext } from "@/lib/context/website.context";
import { AuthContext } from "@/lib/context/auth.context";
import { useCart } from "@/lib/context/cart.context";

// ShadCN UI Kütüphaneleri
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Server as ServerIcon,
  PackageCheck,
  ImageIcon,
  NotebookText,
  Tags,
  CheckCircle,
  AlertTriangle,
  Star,
  Heart,
  Share2,
  Eye,
} from "lucide-react";
import Loading from "@/components/loading";
import NotFound from "@/components/not-found";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

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
  const [addedToCart, setAddedToCart] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  // Servislerin kullanımı
  const { getProductById } = useProductService();
  const { getCategory } = useCategoryService();
  const { getServer } = useServerService();
  const { purchaseProduct } = useMarketplaceService();
  const { website } = useContext(WebsiteContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { addToCart } = useCart();
  const router = useRouter();

  // Fiyat hesaplamaları
  const originalPrice = Number(product?.price) || 0;
  const discountValue = Number(product?.discountValue);
  const validDiscountType = product?.discountType === "percentage" || product?.discountType === "fixed";
  const hasDiscount = !isNaN(discountValue) && discountValue > 0 && validDiscountType;
  const discountAmount =
    product?.discountType === "percentage"
      ? (originalPrice * discountValue) / 100
      : discountValue;
  const finalPrice = hasDiscount ? originalPrice - discountAmount : originalPrice;

  const isOutOfStock = product?.stock === 0;
  const isLowStock = product?.stock && product.stock > 0 && product.stock <= 10;

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
          getServer(productData.server_id),
        ]);

        setCategory(categoryData);
        setServer(serverData);
      } catch (err) {
        setError(
          "Ürün, kategori veya sunucu bilgileri yüklenemedi. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [product_id]);

  // Sepete ekleme işlemi
  const handleAddToCart = () => {
    if (!product || isOutOfStock) return;
    
    addToCart(product.id);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  // Satın alma işlemi
  const handlePurchase = async () => {
    if (!product || !isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    }

    if (isOutOfStock) return;

    setPurchasing(true);
    
    try {
      withReactContent(Swal)
        .fire({
          title: "Satın Alma İşlemi",
          text: `"${product.name}" ürününü satın almak istediğinize emin misiniz?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Evet, satın al",
          cancelButtonText: "Hayır, iptal et",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              await purchaseProduct([product.id]);
              withReactContent(Swal).fire({
                title: "Satın Alma Başarılı",
                text: "Ürün başarıyla satın alındı. Sandığa yönlendiriliyorsunuz...",
                icon: "success",
                confirmButtonText: "Tamam",
                timer: 2000,
                timerProgressBar: true,
              }).then(() => {
                router.push("/chest");
              });
            } catch (error: any) {
              withReactContent(Swal).fire({
                title: "Satın Alma Hatası",
                text: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
                icon: "error",
                confirmButtonText: "Tamam",
              });
            }
          }
        });
    } finally {
      setPurchasing(false);
    }
  };

  // Yüklenme ve Hata durumları için arayüzler
  if (loading) {
    return <Loading show={true} message="Ürün detayları yükleniyor..." />;
  }

  if (error || !product) {
    return <NotFound error={error as string} header="Ürün Bulunamadı" navigateTo="/store" backToText="Mağazaya Geri Dön"/>
  }

  // Arayüz (JSX)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Geri Dön
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  Ürün Detayları
                </span>
                {category && (
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {category.name}
                  </span>
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-gray-600 hover:text-gray-800">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Sol Taraf: Görsel ve Açıklama */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ürün Görseli */}
            <Card className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-blue-50/50">
              <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 drop-shadow-lg hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <ImageIcon className="h-16 w-16 mb-2" />
                    <span className="text-sm">Resim Yok</span>
                  </div>
                )}
                
                {/* Stok Durumu Badge */}
                <div className="absolute top-4 left-4 z-10">
                  {isOutOfStock ? (
                    <Badge 
                      variant="destructive" 
                      className="bg-red-500 hover:bg-red-600 text-white border-red-600 shadow-lg text-xs font-medium px-3 py-1"
                    >
                      <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
                      Stokta Yok
                    </Badge>
                  ) : isLowStock ? (
                    <Badge 
                      variant="secondary" 
                      className="bg-yellow-500 hover:bg-yellow-500 text-white border-amber-600 shadow-md text-xs font-medium px-3 py-1"
                    >
                      <Package className="h-3 w-3 mr-1 flex-shrink-0" />
                      Son {product.stock}
                    </Badge>
                  ) : null}
                </div>

                {/* İndirim Badge */}
                {hasDiscount && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-red-500 text-white text-xs font-medium px-3 py-1 shadow-lg">
                      {product.discountType === "percentage"
                        ? `%${discountValue}`
                        : `${discountAmount.toFixed(0)}₺`}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Ürün Açıklaması */}
            <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-purple-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
                  <NotebookText className="w-6 h-6 text-purple-600" />
                  Ürün Açıklaması
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-base">
                  {product.description ||
                    "Bu ürün için bir açıklama girilmemiş."}
                </p>
                
                {/* Etiketler Bölümü */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3 flex items-center gap-2 text-gray-700">
                      <Tags className="w-5 h-5 text-purple-500" />
                      Etiketler
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf: Satın Alma ve Bilgiler */}
          <div className="lg:col-span-1 space-y-8">
            {/* Fiyat Bilgisi */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 shadow-xl border-0">
              <CardContent className="p-6">
                <div className="space-y-3">
                  {hasDiscount ? (
                    <div className="space-y-2">
                      <span className="text-lg text-gray-500 line-through">
                        {originalPrice.toFixed(2)} ₺
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-4xl font-extrabold text-green-600">
                          {finalPrice.toFixed(2)} ₺
                        </span>
                        <Badge className="bg-red-500 text-white text-sm font-medium px-3 py-1">
                          {product.discountType === "percentage"
                            ? `%${discountValue} İndirim`
                            : `${discountAmount.toFixed(0)}₺ İndirim`}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <span className="text-4xl font-extrabold text-blue-600">
                      {originalPrice.toFixed(2)} ₺
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Satın Alma Kartı */}
            <Card className="bg-gradient-to-br from-green-50 to-blue-50 shadow-xl border-0">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Hemen Sahip Ol</CardTitle>
                <CardDescription className="text-gray-600">
                  Güvenli ve hızlı bir şekilde satın al.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  size="lg"
                  onClick={handlePurchase}
                  disabled={isOutOfStock || purchasing}
                  className={`
                    w-full h-12 text-lg font-medium transition-all duration-200 ease-in-out hover:scale-[1.02]
                    ${isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : hasDiscount
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    }
                  `}
                >
                  {purchasing ? (
                    <Spinner className="h-5 w-5 mr-2" />
                  ) : (
                    <CreditCard className="mr-2 h-5 w-5" />
                  )}
                  {isOutOfStock ? "Stok Tükendi" : purchasing ? "İşleniyor..." : "Hemen Satın Al"}
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addedToCart}
                  className={`
                    w-full h-12 text-lg font-medium transition-all duration-300 ease-in-out hover:scale-[1.02]
                    ${isOutOfStock
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300"
                      : addedToCart
                      ? "bg-emerald-500 text-white cursor-default border-emerald-500"
                      : "text-orange-600 border-orange-500 hover:bg-orange-50 hover:text-orange-700 bg-white"
                    }
                  `}
                >
                  {addedToCart ? (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  ) : (
                    <ShoppingCart className="mr-2 h-5 w-5" />
                  )}
                  {addedToCart ? "Sepete Eklendi!" : "Sepete Ekle"}
                </Button>
              </CardContent>
            </Card>

            {/* Ürün Bilgileri */}
            <Card className="shadow-xl border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Ürün Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-purple-500" />
                    Kategori
                  </span>
                  <Badge
                    variant="secondary"
                    className="cursor-pointer bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                    onClick={() => category && router.push(`/store/category/${category.id}`)}
                  >
                    {category?.name || "Yükleniyor..."}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center gap-2">
                    <ServerIcon className="w-4 h-4 text-blue-500" />
                    Sunucu
                  </span>
                  <span className="font-medium text-gray-800">
                    {server?.name || "Yükleniyor..."}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-green-500" />
                    Stok Durumu
                  </span>
                  <span
                    className={`font-medium ${
                      isOutOfStock ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {isOutOfStock ? "Tükendi" : `${product.stock} Adet`}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Ürün ID
                  </span>
                  <span className="font-mono text-xs text-gray-500">
                    {product.id}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
