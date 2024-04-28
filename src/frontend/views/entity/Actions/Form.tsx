/* eslint-disable no-param-reassign */
import { SchemaForm } from "frontend/components/SchemaForm";
import { useEffect, useState } from "react";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import {
  ActionIntegrations,
  IFormAction,
  IIntegrationsList,
} from "shared/types/actions";
import { userFriendlyCase } from "shared/lib/strings/friendly-case";
import { DataEventActions } from "shared/types/data";
import { msg } from "@lingui/macro";
import { typescriptSafeObjectDotEntries } from "shared/lib/objects";
import { i18nNoop } from "translations/fake";
import { useIntegrationImplementationsList } from "./form-actions.store";
import { FORM_ACTION_CRUD_CONFIG } from "./constants";

interface IProps {
  onSubmit: (formAction: IFormAction) => Promise<void>;
  initialValues?: Partial<IFormAction>;
  formAction: "create" | "update";
  integrationsList: IIntegrationsList[];
  activatedIntegrations: ActionIntegrations[];
  entity: string;
}

const CONFIGURATION_FORM_PREFIX = "configuration__";

export function ActionForm({
  onSubmit,
  initialValues = {},
  formAction,
  integrationsList,
  activatedIntegrations,
  entity,
}: IProps) {
  const integrationsListMap = Object.fromEntries(
    integrationsList.map((action) => [action.key, action])
  );
  const activatedOptions = activatedIntegrations.map((integration) => ({
    label: i18nNoop(integrationsListMap[integration].title),
    value: integration,
  }));

  const [integration, setIntegration] = useState("");
  const [action, setAction] = useState("");

  const implementations = useIntegrationImplementationsList(integration);

  const currentActionTitle = integrationsListMap[integration]?.title;
  const selectedImplementation = Object.fromEntries(
    typescriptSafeObjectDotEntries(
      implementations.data.find(({ key }) => key === action)
        ?.configurationSchema || {}
    ).map(([key, value]) => [
      `${CONFIGURATION_FORM_PREFIX}${String(key)}`,
      {
        ...value,
        label: `${currentActionTitle}: ${userFriendlyCase(String(key))}`,
      },
    ])
  );

  useEffect(() => {
    if (initialValues.integration) {
      setIntegration(initialValues.integration || "");
    }
    if (initialValues.action) {
      setAction(initialValues.action || "");
    }
  }, [initialValues]);

  const fields: IAppliedSchemaFormConfig<any> = {
    trigger: {
      label: msg`Trigger`,
      type: "selection",
      selections: [
        {
          label: msg`On Create`,
          value: DataEventActions.Create,
        },
        {
          label: msg`On Update`,
          value: DataEventActions.Update,
        },
        {
          label: msg`On Delete`,
          value: DataEventActions.Delete,
        },
      ],
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    integration: {
      label: msg`Integration`,
      selections: activatedOptions,
      type: "selection",
      validations: [{ validationType: "required" }],
      formState: ($) => ({
        disabled: !$.formValues.trigger,
      }),
      onChange: setIntegration,
    },
    action: {
      label: msg`Action`,
      type: "selection",
      validations: [{ validationType: "required" }],
      selections: implementations.data.map(({ key, label }) => ({
        label,
        value: key,
      })),
      formState: ($) => ({
        disabled: !$.formValues.trigger,
      }),
      onChange: setAction,
    },
    ...selectedImplementation,
  };
  initialValues = { ...initialValues, entity };

  const initialValues$1 = typescriptSafeObjectDotEntries(
    initialValues.configuration || {}
  ).reduce((values, [key, value]) => {
    return { ...values, [`${CONFIGURATION_FORM_PREFIX}${key}`]: value };
  }, initialValues);

  return (
    <SchemaForm<IFormAction>
      buttonText={
        formAction === "create"
          ? FORM_ACTION_CRUD_CONFIG.FORM_LANG.CREATE
          : FORM_ACTION_CRUD_CONFIG.FORM_LANG.UPDATE
      }
      initialValues={initialValues$1}
      fields={fields}
      systemIcon={formAction === "create" ? "Plus" : "Save"}
      action={formAction}
      onSubmit={async (value) => {
        const cleanedConfigurationForm = typescriptSafeObjectDotEntries(
          value
        ).reduce(
          (cleanForm, [formKey, formValue]) => {
            if (formKey.startsWith(CONFIGURATION_FORM_PREFIX)) {
              const key = formKey.replace(CONFIGURATION_FORM_PREFIX, "");
              return {
                ...cleanForm,
                configuration: { ...cleanForm.configuration, [key]: formValue },
              };
            }
            return { ...cleanForm, [formKey]: formValue };
          },
          { configuration: {} }
        ) as IFormAction;

        await onSubmit(cleanedConfigurationForm);
      }}
    />
  );
}
