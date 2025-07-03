import { Card, CardContent } from "@/components/ui/card";
import { FaRegNewspaper, FaThumbtack } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { lexicalToPlainText } from "@/lib/utils";
import { translatePostType } from "@/lib/utils";

const LatestPostCard = ({ post }: { post: any }) => {
  const plainText = lexicalToPlainText(post.content) || "";
  return (
    <Card className="group py-0 relative flex flex-col sm:flex-row items-stretch gap-0 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/80 rounded-3xl shadow-2xl border border-white/10 dark:border-gray-700/50 overflow-hidden min-h-[18rem] transition-transform duration-300 hover:scale-[1.025] hover:shadow-3xl">
      {post.isPinned && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1 text-blue-600 bg-white/90 dark:bg-gray-900/90 px-3 py-1.5 rounded-lg shadow text-xs font-bold tracking-wide">
          <FaThumbtack className="mr-1" /> Sabit
        </div>
      )}
      <div className="relative w-full sm:w-80 min-h-[14rem] sm:min-h-[18rem] h-full flex-shrink-0 overflow-hidden rounded-tl-3xl rounded-bl-3xl">
        {post.featuredImage ? (
          <>
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${post.featuredImage}`}
              alt={post.title}
              className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 rounded-tl-3xl rounded-bl-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10 rounded-tl-3xl rounded-bl-3xl" />
            <div className="absolute bottom-0 left-0 right-0 z-20 p-5 flex flex-col gap-1">
              <span className="inline-block bg-blue-600/90 text-white text-xs font-semibold px-3 py-1 rounded-full mb-1 w-fit shadow-lg">
                {translatePostType(post.type)}
              </span>
              <h3 className="font-bold text-2xl text-white drop-shadow mb-0 line-clamp-2">
                {post.title}
              </h3>
              {post.publishedAt && (
                <span className="text-xs text-gray-200 mt-1">
                  {new Date(post.publishedAt).toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' })} {new Date(post.publishedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900 dark:bg-gray-800">
            <FaRegNewspaper className="text-gray-400 text-5xl" />
          </div>
        )}
      </div>
      <CardContent className="flex-1 flex flex-col p-6 sm:p-8 relative z-10 min-h-[14rem] sm:min-h-[18rem] h-full">
        <div className="flex-1">
          <p className="text-base text-gray-100 dark:text-gray-200 mb-6 line-clamp-4 font-medium break-all w-full">
            {plainText.slice(0, 220)}{plainText.length > 220 ? '...' : ''}
          </p>
        </div>
        <div className="flex justify-end self-end mt-auto">
          <Link href={`/posts/${post.slug}`}>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white px-6 py-2 rounded-xl text-base font-bold shadow-lg transition-all duration-200">
              Devamını Oku
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestPostCard; 