import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useSchemaFormScriptContext } from "frontend/components/SchemaForm/useSchemaFormScriptContext";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { ToastService } from "frontend/lib/toast";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { evalJavascriptString } from "frontend/lib/script-runner";
import { AppConfigurationKeys } from "shared/configurations";

interface IProps {
  value: string;
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  placeholder: string;
  field: string;
  configurationKey: AppConfigurationKeys;
  error?: unknown;
}

const BASE_SUFFIX = `script`;

export function ScriptForm({
  value,
  onSubmit,
  field,
  error,
  placeholder,
  isLoading,
  configurationKey,
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
            placeholder,
          },
        }}
        onSubmit={async (data) => {
          try {
            const jsString = data[`${BASE_SUFFIX}${field}`] as string;
            evalJavascriptString(jsString, {
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
          MAKE_APP_CONFIGURATION_CRUD_CONFIG(configurationKey).FORM_LANG.UPSERT
        }
        initialValues={{
          [`${BASE_SUFFIX}${field}`]: value,
        }}
      />
    </ViewStateMachine>
  );
}
