import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useUserHasPermission } from "frontend/hooks/auth/user.store";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { META_USER_PERMISSIONS } from "shared/constants/user";
import { ITableTab } from "shared/types/data";
import { GranularEntityPermissions } from "shared/types/user";

export const useWidgetNavigationLink = (entity?: string, queryId?: string) => {
  const userHasPermission = useUserHasPermission();
  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    queryId ? entity : SLUG_LOADING_VALUE
  );

  if (!entity) {
    return undefined;
  }

  if (
    !userHasPermission(
      META_USER_PERMISSIONS.APPLIED_CAN_ACCESS_ENTITY(
        entity,
        GranularEntityPermissions.Show
      )
    )
  ) {
    return undefined;
  }

  const tabTitle = entityViews.data.find(({ id }) => id === queryId)?.title;

  const tabLink = queryId ? `?tab=${tabTitle}` : "";

  return NAVIGATION_LINKS.ENTITY.TABLE(entity) + tabLink;
};
