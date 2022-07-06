import { useEntityDataReference } from 'frontend/hooks/data/data.store';
import { StyledLinkLikeButton } from '@gothicgeeks/design-system';
import { useDetailsOffCanvasStore } from './hooks/useDetailsOffCanvas.store';

interface IProps {
  entity: string;
  id: string;
}

export function ReferenceComponent({ entity, id }: IProps) {
  const openDetailsCanvas = useDetailsOffCanvasStore((state) => state.open);

  const entityDataReference = useEntityDataReference(entity, id);

  if (entityDataReference.isLoading) {
    return <>Loading...</>;
  }

  if (entityDataReference.error) {
    return <span>{id}</span>;
  }

  return (
    <StyledLinkLikeButton onClick={() => openDetailsCanvas({ entity, id })}>
      {entityDataReference.data || id}
    </StyledLinkLikeButton>
  );
}
