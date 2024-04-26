import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { ToastService } from "frontend/lib/toast";
import { MAKE_APP_CONFIGURATION_CRUD_CONFIG } from "frontend/hooks/configuration/configuration.constant";
import { AppConfigurationKeys } from "shared/configurations";
import { evalJavascriptString } from "shared/lib/script-runner";
import { useEvaluateScriptContext } from "frontend/hooks/scripts";
import { ISchemaFormScriptProps } from "shared/form-schemas/types";
import { msg } from "@lingui/macro";
import { i18nNoop } from "shared/lib/noop";

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
  const evaluateScriptContext = useEvaluateScriptContext();

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
            label: msg`Script`,
            validations: [],
            placeholder: msg`${i18nNoop(placeholder)}`,
          },
        }}
        onSubmit={async (data) => {
          try {
            const jsString = data[`${BASE_SUFFIX}${field}`] as string;
            const context: ISchemaFormScriptProps<{}> = {
              ...evaluateScriptContext,
              action: "test",
              formValues: {},
            };
            evalJavascriptString(jsString, context);
            await onSubmit(jsString);
          } catch (e) {
            ToastService.error(`•Expression: \n•JS-Error: ${e}`);
          }
        }}
        systemIcon="Save"
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
