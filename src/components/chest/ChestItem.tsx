import { ChestItem } from "@/lib/types/chest";
import { usePathname, useRouter } from "next/navigation";
import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useState } from "react";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { useChestService } from "@/lib/services/chest.service";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ChestItemCard({ item }: { item: ChestItem }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useContext(AuthContext);
  const { useChestItem } = useChestService();
  const [itemIsUsed, setItemIsUsed] = useState(item.used);

  if (!item || !item.id || !item.product) {
    return null;
  }

  const handleClick = () => {
    router.push(`/store/products/${item.product.id}`);
  };

  const handleUseClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated || !user?.id) {
      router.push("/auth/sign-in");
      return;
    }

    if (itemIsUsed) {
      return; // Prevent action if item is already used
    }

    withReactContent(Swal)
      .fire({
        title: "Eşya Kullanımı",
        text: `Bu eşyayı kullanmak istediğinize emin misiniz?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Evet, kullan",
        cancelButtonText: "Hayır, iptal et",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          useChestItem(user.id, item.id)
            .then(() => {
              withReactContent(Swal).fire({
                title: "Kullanım Başarılı",
                text: "Eşya başarıyla kullanıldı.",
                icon: "success",
                confirmButtonText: "Tamam",
                timer: 2000,
              });
              setItemIsUsed(true);
            })
            .catch((error) => {
              withReactContent(Swal).fire({
                title: "Kullanım Hatası",
                text:
                  error.message || "Bir hata oluştu. Lütfen tekrar deneyin.",
                icon: "error",
                confirmButtonText: "Tamam",
              });
            });
        } else {
          withReactContent(Swal).fire({
            title: "İptal Edildi",
            text: "Eşya kullanımı iptal edildi.",
            icon: "info",
            confirmButtonText: "Tamam",
          });
        }
      });
  };

  return (
    <Card
      onClick={handleClick}
      className={`relative overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group ${
        itemIsUsed ? "opacity-60 bg-gray-50" : ""
      }`}
      key={item.id}
    >
      <CardHeader className="pb-2">
        {/* Used Badge */}
        {itemIsUsed && (
          <Badge variant="destructive" className="absolute top-3 left-3 z-10">
            Kullanılmış
          </Badge>
        )}
      </CardHeader>

      <CardContent className="px-4 pb-2">
        {/* Item Image */}
        <div className="flex justify-center items-center h-32 mb-4">
          <img
            src={
              `${process.env.NEXT_PUBLIC_BACKEND_URL}${item.product.image}` ||
              "/images/default-item.png"
            }
            alt={item.product.name}
            className={`max-w-full max-h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-200 ${
              itemIsUsed ? "grayscale" : ""
            }`}
          />
        </div>

        {/* Item Info */}
        <div className="text-center">
          <h3 className="text-base font-semibold text-gray-800 mb-1 line-clamp-2">
            {item.product.name}
          </h3>

          {item.product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {item.product.description}
            </p>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        {/* Use Button */}
        <Button
          onClick={handleUseClick}
          disabled={itemIsUsed}
          className={`w-full font-medium transition-colors duration-200 ${
            itemIsUsed
              ? "bg-gray-400 hover:bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
          size="sm"
        >
          {itemIsUsed ? "Kullanılmış" : "Kullan"}
        </Button>
      </CardFooter>
    </Card>
  );
}
