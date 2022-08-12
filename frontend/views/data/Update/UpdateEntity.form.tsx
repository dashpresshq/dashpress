import { ButtonLang } from "@gothicgeeks/shared";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { IBaseEntityForm, IEntityFormSettings } from "../types";
import { buildAppliedSchemaFormConfig } from "../buildAppliedSchemaFormConfig";

type IProps = IBaseEntityForm & {
  initialValues?: Record<string, unknown>;
} & IEntityFormSettings;

export function UpdateEntityForm(props: IProps) {
  // TODO Send only changed fields
  const { onSubmit, initialValues } = props;

  return (
    <SchemaForm
      buttonText={ButtonLang.update}
      onSubmit={onSubmit}
      initialValues={initialValues}
      fields={buildAppliedSchemaFormConfig(props)}
    />
  );
}
