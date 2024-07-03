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
    <div className="flex gap-2 flex-col px-6 mt-2">
      {SCHEMA.map((type, index) => {
        if (type === "header") {
          return (
            <Skeleton
              key={index}
              className="h-4 bg-[hsla(0,0%,0%,0.3)] max-w-24"
            />
          );
        }
        return <Skeleton key={index} className="h-6 bg-[hsla(0,0%,0%,0.3)]" />;
      })}
    </div>
  );
}
