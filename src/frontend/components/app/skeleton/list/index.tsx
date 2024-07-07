import { Skeleton } from "@/components/ui/skeleton";

export interface IProps {
  count: number;
}

export function ListSkeleton({ count }: IProps) {
  return (
    <div data-testid="list-skeleton">
      {Array.from({ length: count }, (_, k) => k + 1).map((key) => (
        <Skeleton className="mb-0.5 h-10" key={key} />
      ))}
    </div>
  );
}
