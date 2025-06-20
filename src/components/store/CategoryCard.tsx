import { usePathname, useRouter } from "next/navigation";
export default function CategoryCard({
  category,
}: {
  category: { id: string; name: string; image: string };
}) {
  const router = useRouter();
  const pathname = usePathname();

  if (!category || !category.id || !category.name) {
    return null; // Return null if category data is incomplete
  }

  const handleClick = () => {
  router.push(`${pathname}/category/${category.id}`);
};
  return (
    <div
      onClick={handleClick}
      role="button"
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
      key={category.id}
    >
      {/* Category Image */}
      <img
        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${category.image || "/images/default-category.png"}`}
        alt={category.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{category.name}</h3>
      </div>
    </div>
  );
}
