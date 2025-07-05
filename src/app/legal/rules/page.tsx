import ContentPage from "@/components/ContentPage";
import { BookOpen } from "lucide-react";

export default function RulesPage() {
  return (
    <ContentPage
      title="Kurallar"
      documentType="rules"
      description="Sunucu kurallarımızı okuyarak güvenli ve eğlenceli bir oyun deneyimi yaşayın."
      icon={<BookOpen className="h-5 w-5" />}
    />
  );
}
