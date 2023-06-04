import {
  BaseSkeleton,
  FormButton,
  FormCodeEditor,
  FormInput,
  FormSelect,
  SoftButton,
  Spacer,
  Stack,
  Tabs,
  RenderCode,
  Typo,
} from "@hadmean/chromista";
import {
  required,
  IFormProps,
  makePostRequest,
  resetFormValues,
} from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { Field, Form } from "react-final-form";
import { ITableTab } from "shared/types/data";
import { ISummaryWidgetConfig, IWidgetConfig } from "shared/types/dashboard";
import { ILabelValue } from "types";
import { ROYGBIV } from "shared/constants/colors";
import { IconInputField } from "frontend/components/IconInputField";
import { useMutation } from "react-query";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import { useEffect, useState } from "react";
import { DASHBOARD_WIDGET_HEIGHTS, DASHBOARD_WIDGET_SIZES } from "./constants";
import { WidgetFormField } from "./types";
import { PortalFormFields, PortalFormSchema } from "./portal";
import { WIDGET_CONFIG } from "../constants";
import { DashboardWidgetPresentation } from "../Presentation";
import { DASHBOARD_WIDGETS_CRUD_CONFIG } from "../../constants";

const DashboardTypesOptions: {
  label: string;
  value: IWidgetConfig["_type"];
}[] = Object.entries(WIDGET_CONFIG).map(([value, { label }]) => ({
  label,
  value: value as IWidgetConfig["_type"],
}));

const FormSchema: Partial<Record<IWidgetConfig["_type"], WidgetFormField[]>> = {
  "summary-card": ["color", "icon"],
  table: ["height", "size"],
  ...PortalFormSchema,
};

export function useRunWidgetScript() {
  return useMutation(
    async (script: string) =>
      await makePostRequest(`/api/dashboards/script`, { script })
  );
}

export function DashboardWidgetForm({
  onSubmit,
  initialValues,
  entities,
  action,
}: IFormProps<IWidgetConfig> & {
  entities: ILabelValue[];
  action: "create" | "edit";
}) {
  const [currentTab, setCurrentTab] = useState("");

  const runWidgetScript = useRunWidgetScript();

  useEffect(() => {
    if (initialValues.script) {
      runWidgetScript.mutate(initialValues.script);
    }
  }, [initialValues]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      render={({ handleSubmit, form, pristine, values, submitting }) => {
        const entityViews = useEntityConfiguration<ITableTab[]>(
          "entity_views",
          values.entity
        );

        const formFields = FormSchema[values._type] || [];

        return (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e)?.then(() => {
                try {
                  resetFormValues<Record<string, unknown>>(
                    action === "create",
                    values as unknown as Record<string, unknown>,
                    form as any,
                    initialValues
                  );
                } catch (error) {
                  // Do nothing
                }
              });
            }}
          >
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
            <Field name="entity" validateFields={[]}>
              {({ input, meta }) => (
                <FormSelect
                  label="Link Entity"
                  description="Select the entity the user should be directed to when clicking on the widget"
                  disabledOptions={[]}
                  selectData={entities}
                  meta={meta}
                  input={input}
                />
              )}
            </Field>
            {values.entity && (entityViews.data || []).length > 0 && (
              <Field name="queryId" validateFields={[]}>
                {({ input, meta }) => (
                  <FormSelect
                    label="Entity Tab"
                    description="Select the most appropriate tab of the entity above that the user should be direct to"
                    disabledOptions={[]}
                    selectData={(entityViews.data || []).map(
                      ({ id, title }) => ({
                        label: title,
                        value: id,
                      })
                    )}
                    meta={meta}
                    input={input}
                  />
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
            {values._type && (
              <>
                {/* TODO documumentation on scripts */}
                <Field name="script" validate={required} validateFields={[]}>
                  {({ input, meta }) => (
                    <FormCodeEditor
                      required
                      description="You can write any valid Javascript here but make sure return the data that satisfies the chart schema which you will see when you click on the 'Preview' button below"
                      language="javascript"
                      label="Script"
                      meta={meta}
                      input={input}
                    />
                  )}
                </Field>

                <ViewStateMachine
                  error={runWidgetScript.error}
                  loading={runWidgetScript.isLoading}
                  loader={<BaseSkeleton height={`${values.height || 250}px`} />}
                >
                  {!runWidgetScript.isIdle && (
                    <Tabs
                      currentTab={currentTab}
                      onChange={setCurrentTab}
                      contents={[
                        {
                          label: "Preview",
                          content: (
                            <DashboardWidgetPresentation
                              config={values}
                              isPreview
                              data={{
                                data: runWidgetScript.data,
                                error: false,
                                isLoading: false,
                                isRefetching: false,
                              }}
                            />
                          ),
                        },
                        {
                          label: "Data",
                          content: <RenderCode input={runWidgetScript.data} />,
                        },
                      ]}
                    />
                  )}
                </ViewStateMachine>
              </>
            )}
            <Spacer />
            {process.env.NEXT_PUBLIC_IS_DEMO ? (
              <Stack justify="center">
                <Typo.MD>
                  You will be able to save this form on your own installation
                </Typo.MD>
              </Stack>
            ) : (
              <Stack justify="end" width="auto">
                {values._type && (
                  <SoftButton
                    action={() => {
                      runWidgetScript.mutate(values.script);
                    }}
                    disabled={!values.script}
                    type="button"
                    isMakingActionRequest={runWidgetScript.isLoading}
                    icon="eye"
                    size={null}
                    label="Test Widget Script"
                  />
                )}

                <FormButton
                  text={
                    action === "create"
                      ? DASHBOARD_WIDGETS_CRUD_CONFIG.FORM_LANG.CREATE
                      : DASHBOARD_WIDGETS_CRUD_CONFIG.FORM_LANG.UPDATE
                  }
                  icon={action === "create" ? "add" : "save"}
                  isMakingRequest={submitting}
                  disabled={pristine}
                />
              </Stack>
            )}
          </form>
        );
      }}
    />
  );
}
