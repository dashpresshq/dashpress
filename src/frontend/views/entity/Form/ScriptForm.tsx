import { FormSkeleton, FormSkeletonSchema } from "@hadmean/chromista";
import { SchemaForm } from "frontend/components/SchemaForm";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";

interface IProps {
  value: string;
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  field: string;
  error?: unknown;
}

export function ScriptForm({
  value,
  onSubmit,
  field,
  error,
  isLoading,
}: IProps) {
  return (
    <ViewStateMachine
      loading={isLoading}
      error={error}
      loader={<FormSkeleton schema={[FormSkeletonSchema.RichTextArea]} />}
    >
      <SchemaForm
        fields={{
          [`script${field}`]: {
            type: "json",
            label: "Script",
            validations: [],
          },
        }}
        onSubmit={async (data) => {
          await onSubmit(data[`script${field}`] as string);
        }}
        buttonText="Save"
        initialValues={{
          [`script${field}`]: value,
        }}
      />
    </ViewStateMachine>
  );
}
