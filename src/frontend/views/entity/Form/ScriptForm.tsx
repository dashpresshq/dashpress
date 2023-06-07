import { FormSkeleton, FormSkeletonSchema } from "@hadmean/chromista";
import { ToastService } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ISchemaFormScriptParams } from "frontend/components/SchemaForm/form-run";
import { useSchemaFormScriptContext } from "frontend/components/SchemaForm/useSchemaFormScriptContext";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { evalJavascriptString } from "frontend/lib/script-runner";

interface IProps {
  value: string;
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  field: string;
  error?: unknown;
}

const BASE_SUFFIX = `script`;

export function ScriptForm({
  value,
  onSubmit,
  field,
  error,
  isLoading,
}: IProps) {
  const scriptContext = useSchemaFormScriptContext("test");

  return (
    <ViewStateMachine
      loading={isLoading}
      error={error}
      loader={<FormSkeleton schema={[FormSkeletonSchema.RichTextArea]} />}
    >
      <SchemaForm
        fields={{
          [`${BASE_SUFFIX}${field}`]: {
            type: "json",
            label: "Script",
            validations: [],
          },
        }}
        onSubmit={async (data) => {
          try {
            const jsString = data[`${BASE_SUFFIX}${field}`] as string;
            evalJavascriptString<ISchemaFormScriptParams>(jsString, {
              ...scriptContext,
              formValues: {},
            });
            await onSubmit(jsString);
          } catch (e) {
            ToastService.error(`•Expression: \n•JS-Error: ${e}`);
          }
        }}
        icon="save"
        buttonText={
          MAKE_APP_CONFIGURATION_CRUD_CONFIG("entity_form_extension").FORM_LANG
            .UPSERT
        }
        initialValues={{
          [`${BASE_SUFFIX}${field}`]: value,
        }}
      />
    </ViewStateMachine>
  );
}
