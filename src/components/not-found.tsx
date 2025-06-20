import { error } from "console";
import { Package, ArrowLeft } from "lucide-react";
import router from "next/router";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type Props = {
  error?: string;
  navigateTo: string;
  header?: string
  backToText: string;
};

export default function NotFound({ error, navigateTo = "/", header, backToText = "Geri Dön" }: Props) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-8 text-center">
          <Package className="h-16 w-16 text-red-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-800 mb-2">
            {header || "Aradığınız parçaya ulaşamadık!"}
          </h3>
          <p className="text-red-600 mb-6">
            {error || "Aradığınız şey mevcut değil veya kaldırılmış olabilir."}
          </p>
          <Button onClick={() => router.push(navigateTo)} variant="destructive">
            <ArrowLeft className="h-4 w-4 mr-2" /> {backToText}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
