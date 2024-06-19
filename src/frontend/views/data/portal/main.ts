import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { noop } from "shared/lib/noop";
import { IRenderFormInputProps } from "@/components/app/form/schema/types";

export const usePortalExtendEntityFormConfig = (
  entity: string,
  crudAction: "update" | "create"
):
  | "loading"
  | ((
      formConfig: IAppliedSchemaFormConfig<any>
    ) => IAppliedSchemaFormConfig<any>) => {
  noop(crudAction, entity);
  return (
    formConfig: IAppliedSchemaFormConfig<any>
  ): IAppliedSchemaFormConfig<any> => {
    return formConfig;
  };
};

export function PortalEntityFormComponent() {
  return null;
}

export function PortalDataComponent() {
  return null;
}

export const useExtendRenderFormInputProps = (props: IRenderFormInputProps) => {
  return props;
};
