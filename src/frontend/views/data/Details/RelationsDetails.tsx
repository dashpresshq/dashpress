import { SectionBox } from "@hadmean/chromista";
import {
  NAVIGATION_LINKS,
  useNavigationStack,
  useSetPageDetails,
  useRouteParam,
} from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import {
  useEntityCrudConfig,
  useEntitySlug,
} from "../../../hooks/entity/entity.config";
import { ENTITY_DETAILS_VIEW_KEY } from "./constants";
import { EntityDetailsView } from "./DetailsView";
import { DetailsLayout } from "./_Layout";
import { useCanUserPerformCrudAction } from "../useCanUserPerformCrudAction";

export function EntityRelationDetails() {
  const childEntity = useRouteParam("childEntity");
  const childEntityCrudConfig = useEntityCrudConfig(childEntity);

  const childId = useRouteParam("childId");
  const entity = useEntitySlug();
  const canUserPerformCrudAction = useCanUserPerformCrudAction(childEntity);

  const { backLink } = useNavigationStack();

  useSetPageDetails({
    pageTitle: childEntityCrudConfig.TEXT_LANG.DETAILS,
    viewKey: ENTITY_DETAILS_VIEW_KEY,
    /* This is handled more approprately at useEntityViewStateMachine */
    permission: META_USER_PERMISSIONS.NO_PERMISSION_REQUIRED,
  });

  const actions = [
    {
      icon: "eye" as const,
      action: NAVIGATION_LINKS.ENTITY.DETAILS(childEntity, childId),
      label: "Details",
      crudSetting: canUserPerformCrudAction("details"),
    },
    {
      icon: "edit" as const,
      action: NAVIGATION_LINKS.ENTITY.UPDATE(childEntity, childId),
      label: "Edit",
      crudSetting: canUserPerformCrudAction("update"),
    },
  ];
  // TODO if details === undefined, then show a create field and redirect back here
  return (
    <DetailsLayout entity={entity} menuKey={childEntity}>
      <SectionBox
        title={childEntityCrudConfig.TEXT_LANG.DETAILS}
        backLink={backLink}
        iconButtons={actions.filter(({ crudSetting }) => crudSetting)}
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
