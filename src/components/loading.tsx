import { Spinner } from "./ui/spinner";

type Props = {
  show: boolean;
  message: string;
};

export default function Loading({
  show = false,
  message = "Sayfa yükleniyor...",
}: Props) {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="text-center">
        <Spinner />
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
