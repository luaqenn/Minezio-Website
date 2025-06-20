import { Product } from "@/lib/types/product";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useMarketplaceService } from "@/lib/services/marketplace.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  Image as ImageIcon,
  Coins
} from "lucide-react";

export default function ProductCard({ item }: { item: Product }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { purchaseProduct } = useMarketplaceService();

  if (!item || !item.id || !item.name) {
    return null;
  }

  const handleClick = () => {
    router.push(`/store/product/${item.id}`)
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push("/auth/sign-in");
      return;
    } else {
      withReactContent(Swal)
        .fire({
          title: "Satın Alma İşlemi",
          text: `Bu ürünü satın almak istediğinize emin misiniz?`,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Evet, satın al",
          cancelButtonText: "Hayır, iptal et",
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            purchaseProduct(item.id)
              .then((data) => {
                console.log(data)
                withReactContent(Swal).fire({
                  title: "Satın Alma Başarılı",
                  text: "Ürün başarıyla satın alındı. Sandığa yönlendiriliyorsunuz...",
                  icon: "success",
                  confirmButtonText: "Tamam",
                  timer: 2000,
                }).then(() => {
                  router.push("/chest");
                });
              })
              .catch((error) => {
                withReactContent(Swal).fire({
                  title: "Satın Alma Hatası",
                  text: error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
                  icon: "error",
                  confirmButtonText: "Tamam",
                });
              });
          } else {
            withReactContent(Swal).fire({
              title: "İptal Edildi",
              text: "Satın alma işlemi iptal edildi.",
              icon: "info",
              confirmButtonText: "Tamam",
            });
          }
        });
    }
  };

  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock <= 10;

  return (
    <Card 
      onClick={handleClick}
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border-2 ${
        isOutOfStock 
          ? 'border-red-200 bg-gray-50 opacity-75' 
          : 'border-gray-200 hover:border-blue-300 bg-gradient-to-br from-white to-gray-50'
      }`}
    >
      <CardContent className="p-0">
        {/* Header with Badges */}
        <div className="relative">
          {/* Stock Badge */}
          <div className="absolute top-3 left-3 z-10">
            {isOutOfStock ? (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Stokta Yok
              </Badge>
            ) : isLowStock ? (
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                <Package className="h-3 w-3 mr-1" />
                {item.stock} kaldı
              </Badge>
            ) : null}
          </div>

          {/* Price Badge */}
          <div className="absolute top-3 right-3 z-10">
            <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white">
              <Coins className="h-3 w-3 mr-1" />
              {item.price} ₺
            </Badge>
          </div>

          {/* Product Image */}
          <div className="flex justify-center items-center h-48 p-6 bg-gradient-to-br from-blue-50 to-purple-50">
            {item.image ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.image}`}
                alt={item.name}
                className="max-w-full max-h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-sm">Resim Yok</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 bg-white border-t">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item.name}
          </h3>

          {/* Action Button */}
          <Button 
            onClick={handleBuyClick}
            disabled={isOutOfStock}
            className={`w-full flex items-center justify-center gap-2 transition-all duration-200 ${
              isOutOfStock 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300' 
                : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105'
            }`}
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? 'Stokta Yok' : 'Satın Al'}
          </Button>
        </div>

        {/* Hover Effect Overlay */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </CardContent>
    </Card>
    );
  }