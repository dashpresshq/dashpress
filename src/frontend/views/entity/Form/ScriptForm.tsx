import { useAppConfigurationDomainMessages } from "frontend/hooks/configuration/configuration.constant";
import { AppConfigurationKeys } from "shared/configurations";
import { evalJavascriptString } from "shared/lib/script-runner";
import { useEvaluateScriptContext } from "frontend/hooks/scripts";
import { ISchemaFormScriptProps } from "shared/form-schemas/types";
import { msg } from "@lingui/macro";
import { fakeMessageDescriptor } from "translations/fake";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { SchemaForm } from "@/components/app/form/schema";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { useToast } from "@/components/app/toast/use-toast";

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
  const domainMessages = useAppConfigurationDomainMessages(configurationKey);
  const { toast } = useToast();
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
            placeholder: fakeMessageDescriptor(placeholder),
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
            toast({
              variant: "danger",
              title: msg`Could not parse Javascript`,
              description: msg`•Expression: \n•JS-Error: ${e}`,
            });
          }
        }}
        systemIcon="Save"
        buttonText={domainMessages.FORM_LANG.UPSERT}
        initialValues={{
          [`${BASE_SUFFIX}${field}`]: value,
        }}
      />
    </ViewStateMachine>
  );
}
