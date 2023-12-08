import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { noop } from "shared/lib/noop";

export const usePortalExtendEntityFormConfig = (
  crudAction: "update" | "create"
):
  | "loading"
  | ((
      formConfig: IAppliedSchemaFormConfig<any>
    ) => IAppliedSchemaFormConfig<any>) => {
  noop(crudAction);
  return (
    formConfig: IAppliedSchemaFormConfig<any>
  ): IAppliedSchemaFormConfig<any> => {
    return formConfig;
  };
};
