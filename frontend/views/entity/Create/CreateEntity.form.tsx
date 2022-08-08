import { ButtonLang } from "@gothicgeeks/shared";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { IBaseEntityForm, IEntityFormSettings } from "../types";
import { buildAppliedSchemaFormConfig } from "../buildAppliedSchemaFormConfig";

export function CreateEntityForm(props: IBaseEntityForm & IEntityFormSettings) {
  const { onSubmit } = props;
  return (
    <SchemaForm
      buttonText={ButtonLang.create}
      resetForm
      onSubmit={onSubmit}
      fields={buildAppliedSchemaFormConfig(props)}
    />
  );
}
