/* eslint-disable react/no-array-index-key */
import { Skeleton } from "@/components/ui/skeleton";

export function NavigationSkeleton() {
  const SCHEMA = [
    "header",
    "item",
    "item",
    "header",
    "item",
    "item",
    "item",
    "item",
    "item",
    "header",
    "item",
    "item",
    "item",
    "header",
    "item",
    "item",
    "item",
    "header",
    "item",
    "item",
    "item",
    "item",
    "item",
  ];

  return (
    <div className="mt-2 flex flex-col gap-2 px-6">
      {SCHEMA.map((type, index) => {
        if (type === "header") {
          return (
            <Skeleton
              key={index}
              className="h-4 max-w-24 bg-[oklch(0%_0_0/30%)]"
            />
          );
        }
        return <Skeleton key={index} className="h-6 bg-[oklch(0%_0_0/30%)]" />;
      })}
    </div>
  );
}
