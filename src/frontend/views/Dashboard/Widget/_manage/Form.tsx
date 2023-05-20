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
import { required, IFormProps, makePostRequest } from "@hadmean/protozoa";
import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { NAVIGATION_LINKS } from "frontend/lib/routing";
import { useRouter } from "next/router";
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

const DashboardTypesOptions: {
  label: string;
  value: IWidgetConfig["_type"];
}[] = Object.entries(WIDGET_CONFIG).map(([value, { label }]) => ({
  label,
  value: value as IWidgetConfig["_type"],
}));

const FormSchema: Partial<Record<IWidgetConfig["_type"], WidgetFormField[]>> = {
  "summary-card": ["entity", "queryId", "color", "icon"],
  table: ["entity", "queryId", "height", "size"],
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
}: IFormProps<IWidgetConfig> & {
  entities: ILabelValue[];
}) {
  const router = useRouter();
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
      render={({ handleSubmit, pristine, values }) => {
        const entityViews = useEntityConfiguration<ITableTab[]>(
          "entity_views",
          values.entity
        );

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
              <Field name="entity" validateFields={[]}>
                {({ input, meta }) => (
                  <FormSelect
                    label="Link Entity"
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
                    label="Link Tab"
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
                  text="Save"
                  isMakingRequest={false}
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
