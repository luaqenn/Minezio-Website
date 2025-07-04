import { Skeleton } from "@/components/ui/skeleton";
import Widget from "@/components/widgets/widget";

interface WidgetSkeletonProps {
  lines?: number;
}

export const WidgetSkeleton = ({ lines = 3 }: WidgetSkeletonProps) => (
  <Widget>
    <Widget.Header>
      <Skeleton className="h-5 w-3/5" />
    </Widget.Header>
    <Widget.Body>
      <div className="space-y-3 p-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="h-8 w-8 rounded-md" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-2 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    </Widget.Body>
  </Widget>
); 