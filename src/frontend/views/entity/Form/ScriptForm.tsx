import { FormSkeleton, FormSkeletonSchema } from "@hadmean/chromista";
import { ToastService } from "@hadmean/protozoa";
import { SchemaForm } from "frontend/components/SchemaForm";
import { evalJSFormScript } from "frontend/components/SchemaForm/form-run";
import { useSchemaFormScriptContext } from "frontend/components/SchemaForm/useSchemaFormScriptContext";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";

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
            evalJSFormScript(jsString, scriptContext, {});
            await onSubmit(jsString);
          } catch (e) {
            ToastService.error(`•Expression: \n•JS-Error: ${e}`);
          }
        }}
        buttonText="Save"
        initialValues={{
          [`${BASE_SUFFIX}${field}`]: value,
        }}
      />
    </ViewStateMachine>
  );
}
