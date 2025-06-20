import { Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type Color = "purple" | "green";

type Props = {
  header: string;
  message: string;
  color: Color;
};

function ColorTranslator(color: Color) {
  switch (color) {
    case "purple":
      return "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200";
    case "green":
      return "bg-gradient-to-r from-green-50 to-blue-50 border-green-200";
    default:
      return "bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200";
  }
}

export default function ContentFooter({ header, message, color }: Props) {
  return (
    <div className="mt-8 text-center">
      <Card className={ColorTranslator(color)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles
              className={`h-5 w-5 ${
                color == "purple" ? "text-purple-600" : "text-green-600"
              }`}
            />
            <h3
              className={`${
                color == "purple" ? "text-purple-800" : "text-green-800"
              }`}
            >
              {header}
            </h3>
          </div>
          <p
            className={`${
              color == "purple" ? "text-purple-700" : "text-green-700"
            }`}
          >
            {message}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
