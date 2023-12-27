import { useAppConfiguration } from "frontend/hooks/configuration/configuration.store";
import { IEntityCrudSettings } from "shared/configurations";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { DataStates } from "frontend/lib/data/types";
import { useCanUserPerformCrudAction } from "./useCanUserPerformCrudAction";

export const useEntityViewStateMachine = ({
  crudAction,
  entity,
  error,
  isLoading,
}: {
  isLoading: boolean;
  error: unknown;
  crudAction: keyof IEntityCrudSettings;
  entity: string;
}):
  | { type: DataStates.Loading }
  | { type: DataStates.Loaded }
  | { type: DataStates.Error; message: unknown } => {
  const entitiesToHide = useAppConfiguration("disabled_entities");
  const canUserPerformCrudAction = useCanUserPerformCrudAction(entity);

  if (isLoading || entitiesToHide.isLoading) {
    return { type: DataStates.Loading };
  }
  if (
    (crudAction && !canUserPerformCrudAction(crudAction)) ||
    entitiesToHide.data?.includes(entity)
  ) {
    return {
      type: DataStates.Error,
      message: `The '${userFriendlyCase(
        crudAction
      )}' Action For This Resource Is Not Available`,
    };
  }
  if (error) {
    return { type: DataStates.Error, message: error };
  }
  return { type: DataStates.Loaded };
};
