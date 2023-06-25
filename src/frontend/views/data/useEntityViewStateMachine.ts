import { isRouterParamEnabled } from "frontend/hooks";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { IEntityCrudSettings } from "shared/configurations";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { useCanUserPerformCrudAction } from "./useCanUserPerformCrudAction";

export const useEntityViewStateMachine = (
  isLoading: boolean,
  error: unknown,
  actionKey: keyof IEntityCrudSettings,
  entityOverride?: string
):
  | { type: "loading" }
  | { type: "render" }
  | { type: "error"; message: unknown } => {
  const entitiesToHide = useAppConfiguration<string[]>("disabled_entities");
  const entity = useEntitySlug(entityOverride);
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);

  if (isLoading || entitiesToHide.isLoading || !isRouterParamEnabled(entity)) {
    return { type: "loading" };
  }
  if (
    (actionKey && !canUserPerformCrudAction(actionKey)) ||
    entitiesToHide.data?.includes(entity)
  ) {
    return {
      type: "error",
      message: `The '${userFriendlyCase(
        actionKey
      )}' Action For This Resource Is Not Available`,
    };
  }
  if (error) {
    return { type: "error", message: error };
  }
  return { type: "render" };
};
