import { FormSkeleton, FormSkeletonSchema } from "@hadmean/chromista";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { ViewStateMachine } from "frontend/lib/ViewStateMachine";

interface IProps {
  value: string;
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  error?: unknown;
}

export function ScriptForm({ value, onSubmit, error, isLoading }: IProps) {
  return (
    <ViewStateMachine
      loading={isLoading}
      error={error}
      loader={<FormSkeleton schema={[FormSkeletonSchema.RichTextArea]} />}
    >
      <SchemaForm
        fields={{
          script: {
            type: "json",
            label: "",
            validations: [],
          },
        }}
        onSubmit={async (data) => {
          await onSubmit(data.script as string);
        }}
        buttonText="Save"
        initialValues={{
          script: value,
        }}
      />
    </ViewStateMachine>
  );
}
