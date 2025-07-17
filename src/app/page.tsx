"use client";

import { AuthContext } from "@/lib/context/auth.context";
import { useContext, useEffect, useState, useMemo, useCallback, Suspense } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useServerService } from "@/lib/services/server.service";
import { useStatisticsService } from "@/lib/services/statistics.service";
import { IPublicWebsiteStatistics } from "@/lib/types/statistics";
import { Server } from "@/lib/types/server";
import { formatTimeAgo } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { useWebsitePostsService } from "@/lib/services/posts.service";
import LatestPostCard from "@/components/LatestPostCard";
import InnovativeSignups from "@/components/widgets/InnovativeSignups";

// Lazy load heavy components
const InnovativeCarousel = dynamic(
  () => import("@/components/ui/innovative-carousel").then(mod => ({ default: mod.InnovativeCarousel })),
  {
    ssr: false,
    loading: () => <div className="h-[250px] sm:h-[300px] md:h-[350px] lg:h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);

const SlideContent = dynamic(
  () => import("@/components/ui/innovative-carousel").then(mod => ({ default: mod.SlideContent })),
  { ssr: false }
);

const AuthForm = dynamic(
  () => import("@/components/widgets/auth-form").then(mod => ({ default: mod.AuthForm })),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);

const DiscordWidget = dynamic(
  () => import("@/components/widgets/discord-widget"),
  {
    ssr: false,
    loading: () => <div className="h-48 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
  }
);

// UI ve Widget Component'leri
import Widget from "@/components/widgets/widget";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { FaShoppingCart, FaCrown, FaGift, FaUserPlus } from "react-icons/fa";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Badge } from "@/components/ui/badge";

// Boş liste durumunda gösterilecek component
const EmptyList = ({ message }: { message: string }) => (
  <p className="text-center text-xs text-gray-500 dark:text-gray-400 p-4">
    {message}
  </p>
);

// Yükleniyor durumunda gösterilecek widget iskeleti
const WidgetSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <Widget>
    <Widget.Header>
      <Skeleton className="h-5 w-3/5" />
    </Widget.Header>
    <Widget.Body>
      <div className="space-y-3 p-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-2 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </Widget.Body>
  </Widget>
);

// Memoized statistics components
const TopCreditLoaders = ({ loaders }: { loaders: any[] }) => (
  <ul className="space-y-1">
    {loaders.map((loader, index) => (
      <li
        key={loader.id}
        className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
      >
        <span className="w-8 text-center text-lg font-bold text-gray-500 dark:text-gray-400">
          #{index + 1}
        </span>
        <Avatar
          username={loader.username}
          size={32}
          className="mx-2"
        />
        <p className="flex-1 text-sm font-medium text-gray-800 dark:text-gray-100">
          {loader.username}
        </p>
        <span className="font-semibold text-green-600 dark:text-green-400 text-sm">
          {loader.totalAmount.toFixed(2)} ₺
        </span>
      </li>
    ))}
  </ul>
);

const LatestPayments = ({ payments }: { payments: any[] }) => (
  <ul className="space-y-1">
    {payments.map((payment) => (
      <li
        key={payment.id}
        className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
      >
        <Avatar
          username={payment.username}
          size={32}
          className="mr-3"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {payment.username}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {formatTimeAgo(payment.timestamp)}
          </p>
        </div>
        <span className="font-semibold text-green-600 dark:text-green-400 text-sm">
          {payment.amount.toFixed(2)} ₺
        </span>
      </li>
    ))}
  </ul>
);

const LatestPurchases = ({ purchases }: { purchases: any[] }) => (
  <ul className="space-y-1">
    {purchases.map((purchase) => (
      <li
        key={purchase.id}
        className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
      >
        <Avatar
          username={purchase.username}
          size={32}
          className="mr-3"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {purchase.username}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            <Badge className="bg-gradient-to-r from-blue-500/20 via-cyan-400/20 to-blue-400/20 text-blue-700 dark:text-cyan-200 font-semibold shadow-[0_4px_32px_0_rgba(34,211,238,0.12)] scale-105 border-0">{purchase.productName}</Badge> ürününü satın aldı!
          </p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {formatTimeAgo(purchase.timestamp)}
        </span>
      </li>
    ))}
  </ul>
);

const LatestSignups = ({ signups }: { signups: any[] }) => (
  <ul className="space-y-1">
    {signups.map((signup) => (
      <li
        key={signup.id}
        className="flex items-center p-2 rounded-lg transition-colors hover:bg-black/5 dark:hover:bg-gray-700/40"
      >
        <Avatar
          username={signup.username}
          size={32}
          className="mr-3"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
            {signup.username}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Aramıza katıldı
          </p>
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-500">
          {formatTimeAgo(signup.timestamp)}
        </span>
      </li>
    ))}
  </ul>
);

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const { website } = useContext(WebsiteContext);
  const { getServers } = useServerService();
  const { getStatistics } = useStatisticsService();
  const { getPosts } = useWebsitePostsService(website?.id);
  const [server, setServer] = useState<Server | null>(null);
  const [statistics, setStatistics] = useState<IPublicWebsiteStatistics | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [latestPosts, setLatestPosts] = useState<any[] | null>(null);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  // Memoized carousel items
  const carouselItems = useMemo(() =>
    website?.sliders?.map((slider) => ({
      id: slider.id,
      content: (
        <SlideContent
          image={`${process.env.NEXT_PUBLIC_BACKEND_URL}${slider.image}`}
          title={slider.text}
          description={slider.description}
          buttonText={slider.buttonText}
          buttonLink={slider.route}
        />
      ),
    })) || [], [website?.sliders]
  );

  // Optimized data fetching
  const fetchData = useCallback(async () => {
    try {
      const [servers, stats] = await Promise.all([
        getServers(),
        getStatistics()
      ]);

      setServer(servers.find((server) => server.port === 25565) || servers[0]);
      setStatistics(stats);
    } catch (err) {
      withReactContent(Swal).fire({
        title: "Hata!",
        text: "İstatistikler yüklenirken bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamamdır.",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Son gönderileri çek
    const fetchPosts = async () => {
      if (!website?.id) return; // id yoksa fetch etme
      try {
        const res = await getPosts({ websiteId: website.id, params: { limit: 5, sortBy: 'createdAt', sortOrder: 'desc', status: 'published' } });

        setLatestPosts(res.data);
      } catch {
        setLatestPosts([]);
      } finally {
        setIsPostsLoading(false);
      }
    };
    fetchPosts();
  }, [website?.id]);

  return (
    <main className="min-h-screen bg-[#191A1E] text-white">
      <section className="container mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Sol: Başlık, açıklama, buton */}
        <div className="flex-1 max-w-xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FF6B57]">Minezio</h1>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">Her daim güncel ürünler!</h2>
          <p className="text-gray-300">Minezio  olarak, 4 yılı aşkın süredir Minecraft alanında hizmet vermekteyiz. Sağladığımız hizmetlerde optimizasyon ve güvenliği en üst seviyede tutarak, olası sorunları en aza indiriyor ve kullanıcılarımıza sorunsuz bir deneyim sunuyoruz.</p>
          <a href="/store" className="inline-block bg-[#FF6B57] hover:bg-[#ff8a75] text-white font-semibold px-6 py-3 rounded-lg transition">Ürünlerimize göz atın</a>
        </div>
        {/* Sağ: Büyük görsel */}
        <div className="flex-1 flex justify-center">
          <img src="/images/logo.png" alt="Logo" className="w-72 h-72 object-contain animate-float" />
        </div>
      </section>
      {/* Alt: 4 özellik kutusu */}
      <section className="container mx-auto px-4 mt-12">
        <h3 className="text-[#FF6B57] font-semibold mb-2">Neden Bizi Seçmelisiniz?</h3>
        {/* 'Çünkü' yazısı kaldırıldı */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#23242A] rounded-2xl p-6 shadow-md">
            <h5 className="text-lg font-bold mb-2">7/24 Destek</h5>
            <p className="text-gray-300">Destek ekiplerimiz sizin için sürekli çalışıyor.</p>
          </div>
          <div className="bg-[#23242A] rounded-2xl p-6 shadow-md">
            <h5 className="text-lg font-bold mb-2">Periyodik Güncellemeler</h5>
            <p className="text-gray-300">Sistemimiz, her zaman en son özelliklere ve iyileştirmelere sahip olmanızı sağlamak için periyodik güncellemeler sağlar.</p>
          </div>
          <div className="bg-[#23242A] rounded-2xl p-6 shadow-md">
            <h5 className="text-lg font-bold mb-2">Olumlu Geri Bildirimler</h5>
            <p className="text-gray-300">Minezio olarak, mükemmelliğe ve üstün hizmete olan bağlılığımızı besleyen olumlu geri bildirimleri önemsiyoruz.</p>
          </div>
          <div className="bg-[#23242A] rounded-2xl p-6 shadow-md">
            <h5 className="text-lg font-bold mb-2">Mutlu Müşteriler</h5>
            <p className="text-gray-300">Minezio olarak, mutluluğumuz memnun müşterilerden gelir. Onları tatmin eden ve gülümseten deneyimler yaratmaya çalışıyoruz.</p>
          </div>
        </div>
      </section>
      {/* SSS Bölümü */}
      <section className="container mx-auto px-4 mt-20 flex flex-col md:flex-row items-center gap-12">
        {/* Sol: Görsel */}
        <div className="flex-1 flex justify-center">
          <div className="rounded-[35%] w-64 h-64 flex items-center justify-center">
            <img src="/images/logo.png" alt="SSS Karakter" className="w-100 h-100 object-contain" />
          </div>
        </div>
        {/* Sağ: Başlık ve Akordeon */}
        <div className="flex-1 w-full max-w-2xl">
          <h4 className="text-[#FF6B57] font-semibold mb-1">Herhangi bir sorunuz var mı?</h4>
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Sıkça Sorulan Sorular</h2>
          <div className="space-y-4">
            {/* Akordeon örnekleri */}
            <details className="bg-[#191A1E] rounded-xl p-4 text-lg font-medium text-white cursor-pointer">
              <summary className="flex justify-between items-center select-none">Ürünlerde bulunan lisans sistemi nedir?<span className="ml-2">↓</span></summary>
              <p className="mt-2 text-gray-300 text-base">Yazılımın yetkisiz kullanımını önlemek ve her müşterimize güvenli, sorunsuz bir deneyim sunmak amacıyla uygulanmaktadır. Satın alınan her ürün, sadece kullanıcı tarafından belirlenen bir IP adresine tanımlanır ve yalnızca bu IP üzerinde çalışır. Bu sayede, hem sizin yatırımlarınız korunur hem de yazılımın adil kullanımı sağlanır.</p>
            </details>
            <details className="bg-[#191A1E] rounded-xl p-4 text-lg font-medium text-white cursor-pointer">
              <summary className="flex justify-between items-center select-none">Ürün ile alakalı destek alabilir miyim?<span className="ml-2">↓</span></summary>
              <p className="mt-2 text-gray-300 text-base">Ürünümüz orijinal ve lisanslı olduğu sürece, her türlü konuda kesintisiz destek sağlamaktayız. Teknik sorunlardan kurulum aşamasına kadar tüm ihtiyaçlarınızda yanınızdayız.

Ancak ürün içerisinde izinsiz paylaşım (leak) tespit edilmesi halinde, sistemimiz bu durumu otomatik olarak algılar ve lisans devre dışı bırakılır. Bu gibi durumlarda destek hizmeti tamamen sonlandırılır.</p>
            </details>
            <details className="bg-[#191A1E] rounded-xl p-4 text-lg font-medium text-white cursor-pointer">
              <summary className="flex justify-between items-center select-none">İade hakkım var mı?<span className="ml-2">↓</span></summary>
              <p className="mt-2 text-gray-300 text-base">Dijital ürünler kapsamında hiçbir ürünün iade hakkı yoktur.

</p>
            </details>
            <details className="bg-[#191A1E] rounded-xl p-4 text-lg font-medium text-white cursor-pointer">
              <summary className="flex justify-between items-center select-none">Kendi eklentilerimi paketlemenizi isteyebilir miyim?<span className="ml-2">↓</span></summary>
              <p className="mt-2 text-gray-300 text-base">Evet, özel plugin paketi hazırlama hizmetimiz vardır. Fiyatlandırma, taleplerin kapsamına göre belirlenir..</p>
            </details>
          </div>
        </div>
      </section>
      {/* Referanslar Bölümü */}
      <section className="container mx-auto px-4 mt-20 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-[#FF6B57]">Referanslar</h2>
        <div className="flex justify-center mb-8">
          <span className="inline-block w-16 h-1 rounded-full bg-[#FF6B57] opacity-60"></span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Kart 1 */}
          <div className="bg-[#191A1E] border border-[#23242A] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <img src="/images/logo.png" alt="Avatar" className="w-16 h-16 rounded-full mb-4 object-cover" />
            <h5 className="font-bold text-lg mb-1">Nocteria</h5>
            <p className="text-gray-300 text-sm">"Gerçekten hızlı destek ve kaliteli ürünler. Herkese tavsiye ederim!"</p>
          </div>
          {/* Kart 2 */}
          <div className="bg-[#191A1E] border border-[#23242A] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <img src="/images/logo.png" alt="Avatar" className="w-16 h-16 rounded-full mb-4 object-cover" />
            <h5 className="font-bold text-lg mb-1">KuntigoTV</h5>
            <p className="text-gray-300 text-sm">"Yayınlarımızda oyun oynamak için sunucu açmaya karar verdik fakat yeterli bilgimiz olmadığı için bir yardıma ihtiyacımız vardı. Minezio, Ekip yöneticisi Bora bizimle sonuna kadar ilgilendi ve sorunsuz deneyim yaşattı."</p>
          </div>
          {/* Kart 3 */}
          <div className="bg-[#191A1E] border border-[#23242A] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <img src="/images/logo.png" alt="Avatar" className="w-16 h-16 rounded-full mb-4 object-cover" />
            <h5 className="font-bold text-lg mb-1">DeepCraft</h5>
            <p className="text-gray-300 text-sm">"Sunucu açmak yardım istediğinizde sizin için sonuna kadar yardımcı oluyorlar. 10/10"</p>
          </div>
          {/* Kart 4 */}
          <div className="bg-[#191A1E] border border-[#23242A] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <img src="/images/blockrplogo.webp" alt="Avatar" className="w-16 h-16 rounded-full mb-4 object-cover" />
            <h5 className="font-bold text-lg mb-1">BlockRP</h5>
            <p className="text-gray-300 text-sm">"Her zaman ulaşılabilir destek ekibi ve kaliteli hizmet. Çok memnunum"</p>
          </div>
        </div>
      </section>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-18px); }
          100% { transform: translateY(0); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
