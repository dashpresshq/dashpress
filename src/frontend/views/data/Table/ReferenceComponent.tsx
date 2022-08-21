import { useEntityDataReference } from "frontend/hooks/data/data.store";
import { StyledLinkLikeButton } from "@adminator/chromista";
import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useDetailsOffCanvasStore } from "./hooks/useDetailsOffCanvas.store";

interface IProps {
  entity: string;
  id: string;
  displayFrom: "table" | "details" | "canvas";
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
