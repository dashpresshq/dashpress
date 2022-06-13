import { AppLayout } from "../../_layouts/app";
import {
  ErrorAlert,
  SectionBox,
  SectionCenter,
  Spacer,
} from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";
import { NAVIGATION_LINKS } from "../../lib/routing/links";
import {
  useEntityDiction,
  useEntityId,
  useEntitySlug,
} from "../../hooks/entity/entity.config";
import {
  useEntityDataDetails,
} from "../../hooks/data/data.store";
import { EntityActionTypes, useEntityActionMenuItems } from "./Configure/constants";

export function EntityDetails() {
  const entity = useEntitySlug();
  const entityDiction = useEntityDiction();
  const id = useEntityId();
  const dataDetails = useEntityDataDetails(entity, id);
  const actionItems = useEntityActionMenuItems([
    EntityActionTypes.CRUD, EntityActionTypes.Fields
  ]);
  return (
    <AppLayout
      titleNeedsContext={true}
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
        {dataDetails.error ? (
          <>
            <Spacer />
            <ErrorAlert message={dataDetails.error} />
            <Spacer />
          </>
        ) : null}
        <SectionBox
          title={TitleLang.details(entityDiction.singular)}
          backLink={{
            link: NAVIGATION_LINKS.ENTITY.TABLE(entity),
            label: entityDiction.plural,
          }}
        >
          {dataDetails.isFetching || dataDetails.isIdle ? (
            <>TODO Loading Data...</>
          ) : (
            <>{JSON.stringify(dataDetails.data)}</>
          )}
        </SectionBox>
      </SectionCenter>
    </AppLayout>
  );
}
