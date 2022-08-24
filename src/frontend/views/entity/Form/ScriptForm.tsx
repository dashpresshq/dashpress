import {
  ErrorAlert,
  FormSkeleton,
  FormSkeletonSchema,
} from "@hadmean/chromista";
import { SchemaForm } from "frontend/lib/form/SchemaForm";

interface IProps {
  value: string;
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
  error?: unknown;
}

export function ScriptForm({ value, onSubmit, error, isLoading }: IProps) {
  if (isLoading) {
    return <FormSkeleton schema={[FormSkeletonSchema.RichTextArea]} />;
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return (
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
  );
}
