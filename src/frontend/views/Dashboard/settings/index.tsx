import {
  FormButton,
  FormInput,
  FormNumberInput,
  FormSelect,
} from "@hadmean/chromista";
import { required, IFormProps } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { Field, Form } from "react-final-form";
import { ITableTab } from "shared/types/data";
import { ISummaryWidgetConfig, IWidgetConfig } from "shared/types/dashboard";
import { ILabelValue } from "types";
import { ROYGBIV } from "shared/constants/colors";
import { useEntityFields } from "frontend/hooks/entity/entity.store";
import { IconInputField } from "frontend/components/IconInputField";
import { PortalDashboardTypesOptions } from "../widgets/portal";
import { DASHBOARD_WIDGET_HEIGHTS, DASHBOARD_WIDGET_SIZES } from "./constants";
import { WidgetFormField } from "./types";
import { PortalFormFields, PortalFormSchema } from "./portal";

const DashboardTypesOptions: {
  label: string;
  value: IWidgetConfig["_type"];
}[] = [
  ...PortalDashboardTypesOptions,
  {
    label: "Summary Card",
    value: "summary-card",
  },
  {
    label: "Table",
    value: "table",
  },
];

const FormSchema: Partial<Record<IWidgetConfig["_type"], WidgetFormField[]>> = {
  "summary-card": ["entity", "queryId", "color", "icon", "dateField"],
  table: ["entity", "queryId", "height", "size", "limit"],
  ...PortalFormSchema,
};

export function DashboardWidgetForm({
  onSubmit,
  initialValues,
  entities,
}: IFormProps<IWidgetConfig> & { entities: ILabelValue[] }) {
  const router = useRouter();
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, pristine, values }) => {
        const entityViews = useEntityConfiguration<ITableTab[]>(
          "entity_views",
          values.entity
        );

        const entityFields = useEntityFields(values.entity);
        const dateFields = (entityFields.data || [])
          .filter(({ type }) => type === "date")
          .map(({ name }) => ({ value: name, label: name }));

        const formFields = FormSchema[values._type] || [];

        return (
          <form onSubmit={handleSubmit}>
            <Field name="title" validate={required} validateFields={[]}>
              {({ input, meta }) => (
                <FormInput required label="Title" meta={meta} input={input} />
              )}
            </Field>

            <Field name="_type" validate={required} validateFields={[]}>
              {({ input, meta }) => (
                <FormSelect
                  required
                  label="Type"
                  disabledOptions={[]}
                  selectData={DashboardTypesOptions}
                  meta={meta}
                  input={input}
                />
              )}
            </Field>
            {formFields.includes("entity") && (
              <Field name="entity" validate={required} validateFields={[]}>
                {({ input, meta }) => (
                  <FormSelect
                    required
                    label="Entity"
                    disabledOptions={[]}
                    selectData={entities}
                    meta={meta}
                    input={input}
                  />
                )}
              </Field>
            )}
            {formFields.includes("queryId") && values.entity && (
              <Field name="queryId" validateFields={[]}>
                {({ input, meta }) => (
                  <FormSelect
                    label="Query"
                    disabledOptions={[]}
                    selectData={(entityViews.data || []).map(
                      ({ id, title }) => ({
                        label: title,
                        value: id,
                      })
                    )}
                    rightActions={[
                      {
                        label: "Manage Queries",
                        action: () =>
                          router.push(
                            NAVIGATION_LINKS.ENTITY.CONFIG.VIEWS(values.entity)
                          ),
                      },
                    ]}
                    meta={meta}
                    input={input}
                  />
                )}
              </Field>
            )}

            {formFields.includes("limit") && (
              <Field name="limit" validateFields={[]}>
                {({ input, meta }) => (
                  <FormNumberInput label="Limit" meta={meta} input={input} />
                )}
              </Field>
            )}
            <PortalFormFields formFields={formFields} />
            {formFields.includes("color") && (
              <Field name="color" validate={required} validateFields={[]}>
                {({ input, meta }) => (
                  <FormSelect
                    label="Color"
                    required
                    selectData={Object.keys(ROYGBIV).map((value) => ({
                      value,
                      label: value,
                    }))}
                    meta={meta}
                    input={input}
                  />
                )}
              </Field>
            )}
            {formFields.includes("icon") && (
              <IconInputField value={(values as ISummaryWidgetConfig)?.icon} />
            )}
            {formFields.includes("dateField") && (
              <Field name="dateField" validateFields={[]}>
                {({ input, meta }) => (
                  <FormSelect
                    label="Date Field"
                    selectData={dateFields}
                    meta={meta}
                    input={input}
                  />
                )}
              </Field>
            )}
            {formFields.includes("size") && (
              <Field name="size" validateFields={[]}>
                {({ input, meta }) => (
                  <FormSelect
                    label="Size"
                    selectData={DASHBOARD_WIDGET_SIZES}
                    meta={meta}
                    input={input}
                  />
                )}
              </Field>
            )}
            {formFields.includes("height") && (
              <Field name="height" validateFields={[]}>
                {({ input, meta }) => (
                  <FormSelect
                    label="Height"
                    selectData={DASHBOARD_WIDGET_HEIGHTS}
                    meta={meta}
                    input={input}
                  />
                )}
              </Field>
            )}
            <FormButton
              text="Save"
              isMakingRequest={false}
              disabled={pristine}
            />
          </form>
        );
      }}
    />
  );
}
