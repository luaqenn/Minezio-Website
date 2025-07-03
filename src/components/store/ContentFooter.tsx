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
      return "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-purple-200 dark:border-purple-700";
    case "green":
      return "bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900 dark:to-blue-900 border-green-200 dark:border-green-700";
    default:
      return "bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 border-purple-200 dark:border-purple-700";
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
                color == "purple"
                  ? "text-purple-600 dark:text-purple-300"
                  : "text-green-600 dark:text-green-300"
              }`}
            />
            <h3
              className={`${
                color == "purple"
                  ? "text-purple-800 dark:text-purple-200"
                  : "text-green-800 dark:text-green-200"
              }`}
            >
              {header}
            </h3>
          </div>
          <p
            className={`${
              color == "purple"
                ? "text-purple-700 dark:text-purple-300"
                : "text-green-700 dark:text-green-300"
            }`}
          >
            {message}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
