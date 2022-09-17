import { FormButton, FormInput, FormSelect } from "@hadmean/chromista";
import { required, maxLength } from "@hadmean/protozoa";
import { IFormProps } from "frontend/lib/form/types";
import { Field, Form } from "react-final-form";
import { IWidgetConfig } from "shared/types";
import { ILabelValue } from "types";

const DashboardTypesOptions: {
  label: string;
  value: IWidgetConfig["_type"];
}[] = [
  {
    label: "Summary Card",
    value: "summary-card",
  },
  {
    label: "Table",
    value: "table",
  },
];

export function DashboardSettings({
  onSubmit,
  initialValues,
  entities,
}: IFormProps<IWidgetConfig> & { entities: ILabelValue[] }) {
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, pristine }) => (
        <form onSubmit={handleSubmit}>
          <Field name="_type" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormSelect
                label="Type"
                disabledOptions={[]}
                selectData={DashboardTypesOptions}
                meta={meta}
                input={input}
              />
            )}
          </Field>

          <Field name="entity" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormSelect
                label="Entity"
                disabledOptions={[]}
                selectData={entities}
                meta={meta}
                input={input}
              />
            )}
          </Field>

          <Field name="title" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Title" meta={meta} input={input} />
            )}
          </Field>

          <Field name="link.link" validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Link" meta={meta} input={input} />
            )}
          </Field>

          <Field name="link.title" validate={maxLength(32)} validateFields={[]}>
            {({ input, meta }) => (
              <FormInput label="Link Title" meta={meta} input={input} />
            )}
          </Field>

          {/* <Field name="port" validate={required} validateFields={[]}>
            {({ input, meta }) => (
              <FormNumberInput label="Port" meta={meta} input={input} />
            )}
          </Field>

          <Field name="ssl" validateFields={[]} type="checkbox">
            {({ input, meta }) => (
              <FormCheckBox label="Use SSL" meta={meta} input={input} />
            )}
          </Field> */}

          <FormButton text="Save" isMakingRequest={false} disabled={pristine} />
        </form>
      )}
    />
  );
}
