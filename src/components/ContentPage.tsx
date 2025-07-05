"use client";

import { useContext, useEffect, useState } from "react";
import { WebsiteContext } from "@/lib/context/website.context";
import { useLegalService } from "@/lib/services/legal.service";
import LexicalViewer from "@/components/LexicalViewer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, FileText } from "lucide-react";

interface ContentPageProps {
  title: string;
  documentType: 'rules' | 'privacy_policy' | 'terms_of_service';
  description?: string;
  icon?: React.ReactNode;
}

export default function ContentPage({ 
  title, 
  documentType, 
  description,
  icon = <FileText className="h-5 w-5" />
}: ContentPageProps) {
  const { website } = useContext(WebsiteContext);
  const { getLegalDocuments } = useLegalService();
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      if (!website?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        const documents = await getLegalDocuments();
        const documentContent = documents[documentType];
        
        if (documentContent) {
          setContent(documentContent);
        } else {
          setError("Bu sayfa henüz oluşturulmamış.");
        }
      } catch (err) {
        console.error("İçerik yüklenirken hata oluştu:", err);
        setError("İçerik yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [website?.id, documentType]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            {description && <Skeleton className="h-4 w-96 mx-auto" />}
          </div>
          
          {/* Content Skeleton */}
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-4/5" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            {icon}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
          </div>
          
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {description}
            </p>
          )}

          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400">
            {icon}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {title}
            </h1>
          </div>
          
          {description && (
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <Card className="shadow-lg border-0 bg-white dark:bg-gray-900">
          <CardContent className="p-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <LexicalViewer 
                content={content} 
                className="text-gray-800 dark:text-gray-200"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 