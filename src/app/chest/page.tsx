"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Package, PackageOpen, Sparkles } from "lucide-react";

import ChestItemCard from "@/components/chest/ChestItem";
import Loading from "@/components/loading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/lib/context/auth.context";
import { useChestService } from "@/lib/services/chest.service";
import { ChestItem } from "@/lib/types/chest";

export default function ChestPage() {
  const router = useRouter();
  const { user, isLoading: userIsLoading, isAuthenticated } = useContext(AuthContext);
  const { getChestItems } = useChestService();

  const [chest, setChest] = useState<ChestItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChestData = async () => {
      if (!user?.id) return;

      try {
        const items = await getChestItems(user.id);
        setChest(items);
        setError(null);
      } catch (err) {
        setError(
          "Eşyalar yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (userIsLoading) {
      setIsLoading(true);
      return;
    }

    if (!isLoading && user === undefined) {
      router.push("/");
      return;
    }

    fetchChestData();
  }, [user, userIsLoading, isAuthenticated, router]);

  const totalItems = chest?.length || 0;
  const usedItems = chest?.filter((item) => item.used).length || 0;
  const availableItems = totalItems - usedItems;

  if (isLoading || userIsLoading) {
    return <Loading show={true} message="Sandığınız yükleniyor..." />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Sandığım</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-blue-200 dark:border-blue-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      Toplam Eşya
                    </p>
                    <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                      {totalItems}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 border-green-200 dark:border-green-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                      Kullanılabilir
                    </p>
                    <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {availableItems}
                    </p>
                  </div>
                  <Sparkles className="h-8 w-8 text-green-500 dark:text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Kullanılmış
                    </p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {usedItems}
                    </p>
                  </div>
                  <PackageOpen className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Eşyalarım
              </CardTitle>
              {totalItems > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300"
                >
                  {totalItems} eşya
                </Badge>
              )}
            </div>
            <Separator />
          </CardHeader>

          <CardContent className="p-6">
            {totalItems === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Sandığınız boş
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Henüz hiç eşyanız yok. Mağazadan eşya satın alarak sandığınızı
                  doldurmaya başlayın!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {chest.map((item) => (
                  <ChestItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {totalItems > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Eşyalarınızı kullanarak çeşitli avantajlar elde edebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </>
  );
}