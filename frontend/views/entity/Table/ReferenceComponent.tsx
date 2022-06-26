import { useDetailsOffCanvasStore } from "./hooks/useDetailsOffCanvas.store";
import { useEntityDataReference } from "frontend/hooks/data/data.store";
import { StyledLinkLikeButton } from "@gothicgeeks/design-system";

export const ReferenceComponent: React.FC<{ entity: string; id: string }> = ({
  entity,
  id,
}) => {
  const openDetailsCanvas = useDetailsOffCanvasStore((state) => state.open);

  const entityDataReference = useEntityDataReference(entity, id);

  if (entityDataReference.isLoading) {
    return <>Loading...</>;
  }

  if (entityDataReference.error) {
    return <>{id}</>;
  }

  return (
    <TextButton
      onClick={() => openDetailsCanvas({ entity, id })}
      text={entityDataReference.data || id}
    />
  );
};

const TextButton: React.FC<{ onClick: () => void; text: string }> = ({
  onClick,
  text,
}) => {
  return <StyledLinkLikeButton onClick={onClick}>{text}</StyledLinkLikeButton>;
};
