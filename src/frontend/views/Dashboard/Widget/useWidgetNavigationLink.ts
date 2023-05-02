import { SLUG_LOADING_VALUE } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { ITableTab } from "shared/types/data";

export const useWidgetNavigationLink = (entity: string, queryId?: string) => {
  const entityViews = useEntityConfiguration<ITableTab[]>(
    "entity_views",
    queryId ? entity : SLUG_LOADING_VALUE
  );

  const tabTitle = (entityViews.data || []).find(
    ({ id }) => id === queryId
  )?.title;

  const tabLink = queryId ? `?tab=${tabTitle}` : "";

  return NAVIGATION_LINKS.ENTITY.TABLE(entity) + tabLink;
};
