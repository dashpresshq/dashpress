import { SchemaForm } from "frontend/components/SchemaForm";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { IFormProps } from "frontend/lib/form/types";
import { evalJavascriptString } from "frontend/lib/script-runner";
import { ToastService } from "frontend/lib/toast";
import { IPresentationScriptParams } from "frontend/views/data/evaluatePresentationScript";

type IEntityPresentationScript = {
  script: string;
};

export function PresentationScriptForm({
  initialValues,
  onSubmit,
}: IFormProps<IEntityPresentationScript>) {
  return (
    <SchemaForm<IEntityPresentationScript>
      fields={{
        script: {
          type: "json",
          label: "Script",
          validations: [],
        },
      }}
      onSubmit={async (data) => {
        try {
          evalJavascriptString<IPresentationScriptParams>(data.script, {
            field: "test",
            from: "details",
            row: {},
            value: "",
          });

          await onSubmit(data);
        } catch (e) {
          ToastService.error(`•Expression: \n•JS-Error: ${e}`);
        }
      }}
      icon="save"
      buttonText={
        MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_presentation_script")
          .FORM_LANG.UPSERT
      }
      initialValues={initialValues}
    />
  );
}
