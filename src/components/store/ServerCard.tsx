import { useRouter } from "next/navigation";
import Image from "next/image";
export default function ServerCard({
  server,
}: {
  server: { id: string; name: string; image: string };
}) {
  const router = useRouter();

  if (!server || !server.id || !server.name) {
    return null; // Return null if category data is incomplete
  }

  const handleClick = () => {
    router.push(`/store/server/${server.id}`);
  };

  return (
    <div
      onClick={handleClick}
      role="button"
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      key={server.id}
    >
      {/* Category Image */}
      <Image
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${server.image || "/images/default-server.png"}`}
        alt={server.name}
        width={500}
        height={300}
        className="w-full h-48 object-cover"
        priority
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{server.name}</h3>
      </div>
    </div>
  );
}
