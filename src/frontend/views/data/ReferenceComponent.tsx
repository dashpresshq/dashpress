import { useEntityDataReference } from "frontend/hooks/data/data.store";
import { StyledLinkLikeButton } from "@hadmean/chromista";
import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
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
    return <>Loading...</>;
  }

  if (entityDataReference.error) {
    return <span>{id}</span>;
  }

  const displayText = entityDataReference.data || id;

  if (displayFrom === "canvas") {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <>{displayText}</>;
  }

  return (
    <StyledLinkLikeButton
      onClick={() => {
        if (displayFrom === "table") {
          // if (displayFrom === "table" || displayFrom === "details") {
          openDetailsCanvas({ entity, id });
        } else {
          router.push(NAVIGATION_LINKS.ENTITY.DETAILS(entity, id));
        }
      }}
    >
      {displayText}
    </StyledLinkLikeButton>
  );
}
