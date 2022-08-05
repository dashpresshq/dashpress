import { SectionBox } from "@gothicgeeks/design-system";
import { TitleLang } from "@gothicgeeks/shared";

import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
import {
  // useEntityCrudSettings,
  useEntityDiction,
  useEntityId,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { EntityDetailsView } from "./DetailsView";
import { DetailsRelations } from "./DetailsRelations";

export function EntityDetails() {
  const entityDiction = useEntityDiction();
  const id = useEntityId();
  const entity = useEntitySlug();
  // const entityCrudSettings = useEntityCrudSettings();

  const { canGoBack, goBack } = useNavigationStack();
  useSetPageTitle(`${entityDiction.singular} Details`, "ENTITY_DETAILS");

  return (
    <DetailsRelations entity={entity}>
      <SectionBox
        title={TitleLang.details(entityDiction.singular)}
        backLink={
          canGoBack()
            ? {
                action: goBack,
                label: "Go Back",
              }
            : undefined
        }
        deleteAction={() => console.log("")}
        isMakingDeleteRequest={false}
        iconButtons={[
          { icon: "edit", action: "", label: "Edit" },
          { icon: "save", action: "", label: "Clone" },
        ]}
      >
        <EntityDetailsView displayFrom="details" id={id} entity={entity} />
      </SectionBox>
    </DetailsRelations>
  );
}

// TODO

// How to get relation count

// How many views a deal item has

// So we need to send a request

// count /dealViews/:dealItemId/dealItem

// SELECT * FROM dealviews where dealItemId = :dealItemId
