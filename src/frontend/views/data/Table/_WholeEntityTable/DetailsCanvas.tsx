import { msg } from "@lingui/macro";
import { useEntityCrudConfig } from "frontend/hooks/entity/entity.config";
import { NAVIGATION_LINKS } from "frontend/lib/routing/links";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { SoftButton } from "@/components/app/button/soft";
import { OffCanvas } from "@/components/app/off-canvas";

import { EntityDetailsView } from "../../Details/DetailsView";
import { PortalDataComponent } from "../../portal";
import { useDetailsOffCanvasStore } from "../hooks";

export function DetailsCanvas() {
  const router = useRouter();
  const [closeDetailsCanvas, detailsCanvasEntity, detailsCanvasId] =
    useDetailsOffCanvasStore((state) => [state.close, state.entity, state.id]);

  const entityCrudConfig = useEntityCrudConfig(detailsCanvasEntity);

  useEffect(() => {
    closeDetailsCanvas();
  }, [router.asPath]);

  return (
    <>
      <OffCanvas
        title={entityCrudConfig.TEXT_LANG.DETAILS}
        onClose={closeDetailsCanvas}
        show={!!detailsCanvasEntity}
        size="sm"
      >
        <EntityDetailsView
          entityId={detailsCanvasId}
          entity={detailsCanvasEntity}
          displayFrom="canvas"
        />
        <SoftButton
          label={msg`View Full Details`}
          systemIcon="Eye"
          className="w-full"
          action={NAVIGATION_LINKS.ENTITY.DETAILS(
            detailsCanvasEntity,
            detailsCanvasId
          )}
        />
      </OffCanvas>
      <PortalDataComponent />
    </>
  );
}
