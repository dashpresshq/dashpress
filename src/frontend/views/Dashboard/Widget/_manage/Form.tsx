import { useEntityConfiguration } from "frontend/hooks/configuration/configuration.store";
import { Field, Form } from "react-final-form";
import { IWidgetConfig } from "shared/types/dashboard";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { WidgetScriptDocumentation } from "frontend/docs/scripts/widget-scripts";
import { required } from "frontend/lib/validations";
import { resetFormValues } from "frontend/lib/form/utils";
import { ApiRequest } from "frontend/lib/data/makeRequest";
import { IFormProps } from "frontend/lib/form/types";
import { ILabelValue } from "shared/types/options";
import { FormSelect } from "frontend/design-system/components/Form/Select";
import { FormCodeEditor } from "frontend/design-system/components/Form/CodeEditor";
import { loadedDataState } from "frontend/lib/data/constants/loadedDataState";
import { useDocumentationActionButton } from "frontend/docs/constants";
import { GRID_SPAN_OPTIONS } from "frontend/design-system/constants/grid";
import { msg } from "@lingui/macro";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { i18nNoop, transformLabelValueToSelectData } from "translations/fake";
import { MessageDescriptor } from "@lingui/core";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { RenderCode } from "@/components/app/render-code";
import { FormInput } from "@/components/app/form/input/text";
import { DashboardWidgetPresentation } from "../Presentation";
import { BASE_WIDGET_CONFIG } from "../constants";
import { PortalFormFields, PortalFormSchema } from "./portal";
import { WidgetFormField } from "./types";
import { DASHBOARD_WIDGET_HEIGHTS } from "./constants";
import { usePortalDashboardTypesOptions } from "../portal";
import { Skeleton } from "@/components/ui/skeleton";
import { FormGrid } from "@/components/app/form/schema/form-grid";
import { SpectrumColorInputField } from "@/components/app/form/input/spectrum";
import { IconInputField } from "@/components/app/form/input/icon";
import { ViewStateMachine } from "@/components/app/view-state-machine";
import { Tabs } from "@/components/app/tabs";
import { SoftButton } from "@/components/app/button/soft";
import { FormButton } from "@/components/app/button/form";

const FormSchema: Partial<Record<IWidgetConfig["_type"], WidgetFormField[]>> = {
  "summary-card": ["color", "icon"],
  table: [],
  ...PortalFormSchema,
};

const baseDashboardTypesOptions: {
  label: MessageDescriptor;
  value: IWidgetConfig["_type"];
}[] = typescriptSafeObjectDotEntries(BASE_WIDGET_CONFIG).map(
  ([value, { label }]) => ({
    label,
    value: value as IWidgetConfig["_type"],
  })
);

export function useRunWidgetScript() {
  return useMutation({
    mutationFn: async (script: string) =>
      await ApiRequest.POST(`/api/dashboards/script`, { script }),
  });
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

  const documentationActionButton = useDocumentationActionButton(
    msg`Widget Script`
  );

  const domainMessages = useDomainMessages(LANG_DOMAINS.DASHBOARD.WIDGETS);

  useEffect(() => {
    if (initialValues.script) {
      runWidgetScript.mutate(initialValues.script);
    }
  }, [initialValues]);

  const portalDashboardTypesOptions = usePortalDashboardTypesOptions();

  return (
    <>
      <Form
        onSubmit={onSubmit}
        initialValues={initialValues}
        render={({ handleSubmit, form, pristine, values, submitting }) => {
          const tableViews = useEntityConfiguration(
            "table_views",
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
              <FormGrid.Root>
                <FormGrid.Item $span="9">
                  <Field name="title" validate={required} validateFields={[]}>
                    {({ input, meta }) => (
                      <FormInput
                        required
                        label={msg`Title`}
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                </FormGrid.Item>
                <FormGrid.Item $span="3">
                  <Field name="_type" validate={required} validateFields={[]}>
                    {({ input, meta }) => (
                      <FormSelect
                        required
                        label={msg`Type`}
                        disabledOptions={[]}
                        selectData={[
                          ...baseDashboardTypesOptions,
                          ...portalDashboardTypesOptions,
                        ]}
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                </FormGrid.Item>
                <FormGrid.Item>
                  <Field name="entity" validateFields={[]}>
                    {({ input, meta }) => (
                      <FormSelect
                        label={msg`Link Entity`}
                        description="Select the entity the user should be directed to when clicking on the widget"
                        disabledOptions={[]}
                        selectData={transformLabelValueToSelectData(entities)}
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                </FormGrid.Item>
                {values.entity && (tableViews.data || []).length > 0 && (
                  <FormGrid.Item>
                    <Field name="queryId" validateFields={[]}>
                      {({ input, meta }) => (
                        <FormSelect
                          label={msg`Entity Tab`}
                          description="Select the most appropriate tab of the entity above that the user should be direct to"
                          disabledOptions={[]}
                          selectData={(tableViews.data || []).map(
                            ({ id, title }) => ({
                              label: i18nNoop(title),
                              value: id,
                            })
                          )}
                          meta={meta}
                          input={input}
                        />
                      )}
                    </Field>
                  </FormGrid.Item>
                )}

                <PortalFormFields formFields={formFields} />
                <FormGrid.Item>
                  {formFields.includes("color") && (
                    <Field name="color" validate={required} validateFields={[]}>
                      {({ input, meta }) => (
                        <SpectrumColorInputField
                          formInput={{
                            input,
                            meta,
                            label: msg`Color`,
                            required: true,
                          }}
                        />
                      )}
                    </Field>
                  )}
                </FormGrid.Item>
                <FormGrid.Item>
                  {formFields.includes("icon") && <IconInputField />}
                </FormGrid.Item>
                <FormGrid.Item $span="6">
                  <Field name="span" validateFields={[]}>
                    {({ input, meta }) => (
                      <FormSelect
                        label={msg`Width`}
                        selectData={GRID_SPAN_OPTIONS}
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                </FormGrid.Item>
                <FormGrid.Item $span="6">
                  <Field name="height" validateFields={[]}>
                    {({ input, meta }) => (
                      <FormSelect
                        label={msg`Height`}
                        selectData={DASHBOARD_WIDGET_HEIGHTS}
                        meta={meta}
                        input={input}
                      />
                    )}
                  </Field>
                </FormGrid.Item>
                {values._type && (
                  <FormGrid.Item>
                    <Field
                      name="script"
                      validate={required}
                      validateFields={[]}
                    >
                      {({ input, meta }) => (
                        <FormCodeEditor
                          required
                          language="javascript"
                          label={msg`Script`}
                          meta={meta}
                          input={input}
                          rightActions={[documentationActionButton]}
                        />
                      )}
                    </Field>

                    <ViewStateMachine
                      error={runWidgetScript.error}
                      loading={runWidgetScript.isPending}
                      loader={
                        <Skeleton
                          style={{ height: `${values.height || 250}px` }}
                        />
                      }
                    >
                      {!runWidgetScript.isIdle && (
                        <Tabs
                          currentTab={currentTab}
                          onChange={setCurrentTab}
                          contents={[
                            {
                              label: msg`Preview`,
                              id: "preview",
                              content: (
                                <DashboardWidgetPresentation
                                  config={values}
                                  isPreview
                                  data={loadedDataState(runWidgetScript.data)}
                                />
                              ),
                            },
                            {
                              label: msg`Data`,
                              id: "data",
                              content: (
                                <RenderCode input={runWidgetScript.data} />
                              ),
                            },
                          ]}
                        />
                      )}
                    </ViewStateMachine>
                  </FormGrid.Item>
                )}
                <FormGrid.Item>
                  {process.env.NEXT_PUBLIC_IS_DEMO ? (
                    <div className="text-center ">
                      <p className="text-sm mt-4">
                        You will be able to save this form on your own
                        installation
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-4 mt-4">
                      {values._type && (
                        <SoftButton
                          action={() => {
                            runWidgetScript.mutate(values.script);
                          }}
                          disabled={!values.script}
                          isMakingRequest={runWidgetScript.isPending}
                          systemIcon="Eye"
                          size="lg"
                          label={msg`Test Widget Script`}
                        />
                      )}

                      <FormButton
                        text={
                          action === "create"
                            ? domainMessages.FORM_LANG.CREATE
                            : domainMessages.FORM_LANG.UPDATE
                        }
                        systemIcon={action === "create" ? "Plus" : "Save"}
                        isMakingRequest={submitting}
                        disabled={pristine}
                      />
                    </div>
                  )}
                </FormGrid.Item>
              </FormGrid.Root>
            </form>
          );
        }}
      />
      <WidgetScriptDocumentation />
    </>
  );
}
