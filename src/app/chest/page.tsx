"use client";
import ChestItemCard from "@/components/chest/ChestItem";
import Header from "@/components/header";
import { TopBar } from "@/components/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AuthContext } from "@/lib/context/auth.context";
import { WebsiteContext } from "@/lib/context/website.context";
import { useContext } from "react";
import { Package, PackageOpen, Sparkles } from "lucide-react";

export default function ChestPage() {
  const { website } = useContext(WebsiteContext);
  const { user } = useContext(AuthContext);

  const totalItems = user?.chest?.length || 0;
  const usedItems = user?.chest?.filter(item => item.used).length || 0;
  const availableItems = totalItems - usedItems;

  return (
    <>
      <TopBar broadcastItems={website?.broadcast_items} />
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-8 w-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Sandığım</h1>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Toplam Eşya</p>
                    <p className="text-2xl font-bold text-blue-800">{totalItems}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Kullanılabilir</p>
                    <p className="text-2xl font-bold text-green-800">{availableItems}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Kullanılmış</p>
                    <p className="text-2xl font-bold text-gray-800">{usedItems}</p>
                  </div>
                  <PackageOpen className="h-8 w-8 text-gray-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Items Section */}
        <Card className="shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Eşyalarım
              </CardTitle>
              {totalItems > 0 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {totalItems} eşya
                </Badge>
              )}
            </div>
            <Separator />
          </CardHeader>
          
          <CardContent className="p-6">
            {totalItems === 0 ? (
              // Empty State
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Sandığınız boş
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Henüz hiç eşyanız yok. Mağazadan eşya satın alarak sandığınızı doldurmaya başlayın!
                </p>
              </div>
            ) : (
              // Items Grid
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {user?.chest.map((item, index) => (
                  <ChestItemCard key={`${item.id}-${index}`} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Footer Info */}
        {totalItems > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Eşyalarınızı kullanarak çeşitli avantajlar elde edebilirsiniz.
            </p>
          </div>
        )}
      </div>
    </>
  );
}