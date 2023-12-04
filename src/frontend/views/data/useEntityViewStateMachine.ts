import { isRouterParamEnabled } from "frontend/hooks";
import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { useEntitySlug } from "frontend/hooks/entity/entity.config";
import { IEntityCrudSettings } from "shared/configurations";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { DataStates } from "frontend/lib/data/types";
import { useCanUserPerformCrudAction } from "./useCanUserPerformCrudAction";

export const useEntityViewStateMachine = (
  isLoading: boolean,
  error: unknown,
  actionKey: keyof IEntityCrudSettings,
  entityOverride?: string
):
  | { type: DataStates.Loading }
  | { type: DataStates.Loaded }
  | { type: DataStates.Error; message: unknown } => {
  const entitiesToHide = useAppConfiguration("disabled_entities");
  const entity = useEntitySlug(entityOverride);
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);

  if (isLoading || entitiesToHide.isLoading || !isRouterParamEnabled(entity)) {
    return { type: DataStates.Loading };
  }
  if (
    (actionKey && !canUserPerformCrudAction(actionKey)) ||
    entitiesToHide.data?.includes(entity)
  ) {
    return {
      type: DataStates.Error,
      message: `The '${userFriendlyCase(
        actionKey
      )}' Action For This Resource Is Not Available`,
    };
  }
  if (error) {
    return { type: DataStates.Error, message: error };
  }
  return { type: DataStates.Loaded };
};
