import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Server, 
  Users,
  Image as ImageIcon,
  ArrowRight
} from "lucide-react";

export default function ServerCard({
  server,
}: {
  server: { id: string; name: string; image: string; playerCount?: number; isOnline?: boolean };
}) {
  const router = useRouter();

  if (!server || !server.id || !server.name) {
    return null;
  }

  const handleClick = () => {
    router.push(`/store/server/${server.id}`);
  };

  return (
    <Card 
      onClick={handleClick}
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer border-2 border-gray-200 hover:border-blue-300 bg-gradient-to-br from-white to-gray-50"
    >
      <CardContent className="p-0">
        {/* Header with Status Badge */}
        <div className="relative">
          {/* Online Status Badge */}
          <div className="absolute top-3 left-3 z-10">
            <Badge 
              variant={server.isOnline !== false ? "default" : "secondary"} 
              className={`flex items-center gap-1 ${
                server.isOnline !== false 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-500 text-white'
              }`}
            >
              <Server className="h-3 w-3" />
              {server.isOnline !== false ? 'Online' : 'Offline'}
            </Badge>
          </div>

          {/* Player Count Badge */}
          {server.playerCount !== undefined && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="outline" className="bg-white/90 text-gray-700 border-gray-300">
                <Users className="h-3 w-3 mr-1" />
                {server.playerCount}
              </Badge>
            </div>
          )}

          {/* Server Image */}
          <div className="relative h-48 bg-gradient-to-br from-indigo-50 to-cyan-50 overflow-hidden">
            {server.image ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${server.image}`}
                alt={server.name}
                width={500}
                height={300}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                priority
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400 h-full">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-sm">Resim Yok</span>
              </div>
            )}
            
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-200 via-transparent to-purple-200 group-hover:rotate-1 transition-transform duration-700"></div>
            </div>
          </div>
        </div>

        {/* Server Info */}
        <div className="p-4 bg-white border-t relative">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors flex-1">
              {server.name}
            </h3>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300 ml-2" />
          </div>
          
          {/* Animated underline */}
          <div className="mt-2 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </div>

        {/* Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </CardContent>
    </Card>
  );
}