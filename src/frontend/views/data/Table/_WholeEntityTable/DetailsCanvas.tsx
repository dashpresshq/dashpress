import { useEffect } from "react";
import { useRouter } from "next/router";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useEntityCrudConfig } from "frontend/hooks/entity/entity.config";
import { OffCanvas } from "frontend/design-system/components/OffCanvas";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { SoftButton } from "frontend/design-system/components/Button/SoftButton";
import { useDetailsOffCanvasStore } from "../hooks";
import { EntityDetailsView } from "../../Details/DetailsView";

export function DetailsCanvas() {
  const router = useRouter();
  const [closeDetailsCanvas, detailsCanvasEntity, detailsCanvasId] =
    useDetailsOffCanvasStore((state) => [state.close, state.entity, state.id]);

  const entityCrudConfig = useEntityCrudConfig(detailsCanvasEntity);

  useEffect(() => {
    closeDetailsCanvas();
  }, [router.asPath]);

  return (
    <OffCanvas
      title={entityCrudConfig.TEXT_LANG.DETAILS}
      onClose={closeDetailsCanvas}
      show={!!detailsCanvasEntity}
    >
      <EntityDetailsView
        id={detailsCanvasId}
        entity={detailsCanvasEntity}
        displayFrom="canvas"
      />
      <Spacer />
      <SoftButton
        label="View Full Details"
        icon="eye"
        block
        action={NAVIGATION_LINKS.ENTITY.DETAILS(
          detailsCanvasEntity,
          detailsCanvasId
        )}
      />
    </OffCanvas>
  );
}
