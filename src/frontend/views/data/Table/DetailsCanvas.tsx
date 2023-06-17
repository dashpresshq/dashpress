import { OffCanvas, SoftButton, Spacer } from "@hadmean/chromista";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { EntityDetailsView } from "../Details/DetailsView";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import { useEntityCrudConfig } from "../../../hooks/entity/entity.config";
import { useDetailsOffCanvasStore } from "./hooks";

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
