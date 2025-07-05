import ContentPage from "@/components/ContentPage";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      title="Gizlilik Politikası"
      documentType="privacy_policy"
      description="Kişisel verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi alın."
      icon={<Shield className="h-5 w-5" />}
    />
  );
}
