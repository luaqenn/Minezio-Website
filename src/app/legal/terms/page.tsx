import ContentPage from "@/components/ContentPage";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <ContentPage
      title="Kullanım Şartları"
      documentType="terms_of_service"
      description="Hizmetlerimizi kullanırken uymanız gereken şartları ve koşulları öğrenin."
      icon={<FileText className="h-5 w-5" />}
    />
  );
}
