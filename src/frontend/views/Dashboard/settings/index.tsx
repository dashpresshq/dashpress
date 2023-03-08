import { FormButton, FormInput, FormSelect } from "@hadmean/chromista";
import { required, IFormProps } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next/router";
import { Field, Form } from "react-final-form";
import { ITableTab } from "shared/types/data";
import { IWidgetConfig } from "shared/types/dashboard";
import { ILabelValue } from "types";
import { ROYGBIV } from "shared/constants/colors";
import { useEntityFields } from "frontend/hooks/entity/entity.store";
import { IconInputField } from "frontend/components/IconInputField";

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

            {values.entity && (
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

            {values._type === "summary-card" && (
              <>
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
                <IconInputField value={values.icon} />
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
              </>
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
