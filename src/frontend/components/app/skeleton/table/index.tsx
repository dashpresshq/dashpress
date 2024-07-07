import { Skeleton } from "@/components/ui/skeleton";

const columnCount = 5;

export interface IProps {
  lean?: true;
}

export function TableSkeleton({ lean }: IProps) {
  return (
    <div className="p-2">
      {Array.from({ length: lean ? 5 : 10 }, (_, k) => k + 1).map(
        (key, index) => (
          <div key={key}>
            {index > 0 && <Skeleton className="my-1 h-px" />}
            <div className="flex gap-3">
              {Array.from({ length: columnCount }, (_, k) => k + 1).map(
                (key$1) => (
                  <Skeleton
                    className="my-1 h-6"
                    key={key$1}
                    style={{ flex: key$1 % 3 ? 2 : 1 }}
                  />
                )
              )}
              {!lean && (
                <div className="my-1 flex basis-16 gap-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="size-6 rounded-full" />
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
