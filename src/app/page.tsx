// app/page.tsx

"use client";

import { useContext } from "react";
import Link from "next/link";

// Context'ler
import { AuthContext } from "@/lib/context/auth.context";
import { WebsiteContext } from "@/lib/context/website.context";

// Ana Bileşenler
import { TopBar } from "@/components/top-bar";
import Header from "@/components/header";
import { AuthForm } from "@/components/auth-form";

// Shadcn UI Bileşenleri
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";

// Lucide React İkonları
import { PlayCircle, ShieldCheck, Zap, Award } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);

  // Örnek Carousel içeriği
  const carouselItems = [
    {
      title: "Hemen Oynamaya Başla!",
      description: "Sunucularımıza katılarak eşsiz maceralara atılın ve topluluğumuzun bir parçası olun.",
      image: "/images/header-bg.png",
      link: "/play",
      buttonText: "Şimdi Oyna"
    },
    {
      title: "Mağazamızı Keşfedin",
      description: "Oyun deneyiminizi zenginleştirecek özel eşyalar, paketler ve ayrıcalıklar sizi bekliyor.",
      image: "/images/store-bg.jpg", // Farklı bir resim kullanabilirsiniz
      link: "/store",
      buttonText: "Mağazaya Git"
    },
    {
        title: "Topluluğa Katıl",
        description: "Discord sunucumuza gelerek diğer oyuncularla tanışın, etkinliklerden haberdar olun.",
        image: "/images/community-bg.jpg", // Farklı bir resim kullanabilirsiniz
        link: "/discord", // Discord linkiniz
        buttonText: "Discord'a Katıl"
    }
  ];

  return (
    <main className="bg-gray-50/50 dark:bg-gray-900/50">
      <TopBar broadcastItems={website.broadcast_items} />
      <Header />

      {/* Ana İçerik ve Giriş Alanı */}
      <section className="container mx-auto py-12 md:py-20">
        <div className={isAuthenticated ? "" : "grid gap-8 lg:grid-cols-12 items-start"}>
          {/* Sol Taraf - Carousel */}
          <div className={`rounded-xl ${!isAuthenticated ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true,
              }}
              // Autoplay plugini ekleyebilirsiniz
            >
              <CarouselContent>
                {carouselItems.map((item, index) => (
                  <CarouselItem key={index}>
                    <Card className="overflow-hidden border-2 border-transparent hover:border-primary/50 transition-all duration-300">
                      <div 
                        className="relative h-[450px] flex items-end p-8 text-white"
                        style={{ 
                          backgroundImage: `url(${item.image})`, 
                          backgroundSize: 'cover', 
                          backgroundPosition: 'center' 
                        }}
                      >
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                        
                        <div className="relative z-20 max-w-2xl">
                          <h2 className="text-4xl font-extrabold tracking-tight mb-2">{item.title}</h2>
                          <p className="text-lg text-neutral-200 mb-6">{item.description}</p>
                          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                            <Link href={item.link}>
                              <PlayCircle className="mr-2 h-5 w-5" />
                              {item.buttonText}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          {/* Sağ Taraf - Login Formu */}
          {!isAuthenticated && (
            <div className="lg:col-span-4">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">Hesabınıza Giriş Yapın</CardTitle>
                  <CardDescription>Avantajlardan yararlanmak için giriş yapın veya yeni bir hesap oluşturun.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AuthForm asWidget={true} />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {/* Özellikler Bölümü */}
      <section className="bg-white dark:bg-black/20 py-16 md:py-24">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Neden Bizi Seçmelisiniz?</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Oyuncularımıza en iyi deneyimi sunmak için sürekli çalışıyor ve platformumuzu geliştiriyoruz.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Güvenli Alışveriş</CardTitle>
              </CardHeader>
              <CardContent>
                Tüm ödemeleriniz ve kişisel bilgileriniz en yüksek güvenlik standartlarıyla korunur. Gönül rahatlığıyla alışveriş yapabilirsiniz.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Anında Teslimat</CardTitle>
              </CardHeader>
              <CardContent>
                Mağazamızdan satın aldığınız ürünler, ödemeniz onaylandığı anda otomatik olarak oyun içi hesabınıza teslim edilir.
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Kaliteli Destek</CardTitle>
              </CardHeader>
              <CardContent>
                Karşılaştığınız herhangi bir sorunda veya aklınıza takılan bir soruda, destek ekibimiz size yardımcı olmaktan mutluluk duyar.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}