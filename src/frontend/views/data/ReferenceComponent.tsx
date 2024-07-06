import { useEntityDataReference } from "frontend/hooks/data/data.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useDetailsOffCanvasStore } from "./Table/hooks/useDetailsOffCanvas.store";

export type ReferenceDisplayFromTypes = "table" | "details" | "canvas";

interface IProps {
  entity: string;
  id: string;
  displayFrom: ReferenceDisplayFromTypes;
}

export function ReferenceComponent({ entity, id, displayFrom }: IProps) {
  const openDetailsCanvas = useDetailsOffCanvasStore((state) => state.open);
  const router = useRouter();

  const entityDataReference = useEntityDataReference(entity, id);

  if (entityDataReference.isLoading) {
    return <Skeleton className="h-5 w-36" />;
  }

  if (entityDataReference.error) {
    return <span>{id}</span>;
  }

  const displayText = entityDataReference.data || id;

  if (displayFrom === "canvas") {
    return <span>{displayText}</span>;
  }

  return (
    <Button
      variant="link"
      size="lg"
      className="h-auto p-0"
      onClick={() => {
        if (displayFrom === "table" || displayFrom === "details") {
          openDetailsCanvas({ entity, id });
        } else {
          router.push(NAVIGATION_LINKS.ENTITY.DETAILS(entity, id));
        }
      }}
    >
      {displayText}
    </Button>
  );
}
