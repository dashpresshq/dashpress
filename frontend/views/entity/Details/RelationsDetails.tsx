import { SectionBox } from "@gothicgeeks/design-system";
import { TitleLang, useRouteParam } from "@gothicgeeks/shared";
import { useNavigationStack, useSetPageTitle } from "frontend/lib/routing";
import {
  // useEntityCrudSettings,
  useEntityDiction,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout } from "./_Layout";

export function EntityRelationDetails() {
  const childEntity = useRouteParam("childEntity");
  const childEntityDiction = useEntityDiction(childEntity);

  const childId = useRouteParam("childId");
  const entity = useEntitySlug();
  // const entityCrudSettings = useEntityCrudSettings();

  const { canGoBack, goBack } = useNavigationStack();
  useSetPageTitle(`${childEntityDiction.singular} Details`, "ENTITY_DETAILS");

  return (
    <DetailsLayout entity={entity} menuKey={childEntity}>
      <SectionBox
        title={TitleLang.details(childEntityDiction.singular)}
        backLink={
          canGoBack()
            ? {
                action: goBack,
                label: "Go Back",
              }
            : undefined
        }
        // TODO iconButtons={[
        //   { icon: "edit", action: "", label: "Edit" },
        // ]}
      >
        <EntityDetailsView
          displayFrom="details"
          id={childId}
          entity={childEntity}
        />
      </SectionBox>
    </DetailsLayout>
  );
}
