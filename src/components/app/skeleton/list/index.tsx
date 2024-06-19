import { Skeleton } from "@/components/ui/skeleton";

export interface IProps {
  count: number;
}

export function ListSkeleton({ count }: IProps) {
  return (
    <div data-testid="list-skeleton">
      {Array.from({ length: count }, (_, k) => k + 1).map((key) => (
        <Skeleton className="h-10 mb-0.5" key={key} />
      ))}
    </div>
  );
}
