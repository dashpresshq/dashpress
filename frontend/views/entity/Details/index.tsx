import { SectionBox, SectionCenter } from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { AppLayout } from "../../../_layouts/app";
import { NAVIGATION_LINKS } from "../../../lib/routing/links";
import {
  useEntityDiction,
  useEntityId,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import {
  EntityActionTypes,
  useEntityActionMenuItems,
} from "../Configure/constants";
import { EntityDetailsView } from "./DetailsView";

export function EntityDetails() {
  const entityDiction = useEntityDiction();
  const id = useEntityId();
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.Details,
    EntityActionTypes.Types,
    EntityActionTypes.Labels,
  ]);
  const entity = useEntitySlug();

  return (
    <AppLayout
      titleNeedsContext
      breadcrumbs={[
        {
          label: entityDiction.plural,
          value: NAVIGATION_LINKS.ENTITY.TABLE(entity),
        },
        {
          label: "Details",
          value: NAVIGATION_LINKS.ENTITY.DETAILS(entity, id),
        },
      ]}
      actionItems={actionItems}
    >
      <SectionCenter>
        <SectionBox
          title={TitleLang.details(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.TABLE(entity),
            label: entityDiction.plural,
          }}
        >
          <EntityDetailsView id={id} entity={entity} />
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
