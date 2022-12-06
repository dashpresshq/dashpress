/* eslint-disable no-param-reassign */
import { IValueLabel } from "@hadmean/chromista/dist/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { useState } from "react";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import {
  IActionInstance,
  IIntegrationsList,
  IActivatedAction,
  BaseAction,
} from "shared/types/actions";
import { useIntegrationImplementationsList } from "./instances.store";

interface IProps {
  onSubmit: (instance: IActionInstance) => Promise<void>;
  initialValues?: Partial<IActionInstance>;
  entities: IValueLabel[];
  formAction: "create" | "update";
  integrationsList: IIntegrationsList[];
  activatedActions: IActivatedAction[];
  currentView: {
    entity?: string;
    integrationKey?: string;
  };
}

const CONFIGURATION_FORM_PREFIX = "configuration__";

export function ActionForm({
  onSubmit,
  initialValues = {},
  entities,
  formAction,
  integrationsList,
  activatedActions,
  currentView,
}: IProps) {
  const integrationsListMap = Object.fromEntries(
    integrationsList.map((action) => [action.key, action])
  );
  const activatedOptions = activatedActions
    .filter(({ integrationKey }) => {
      if (!currentView.integrationKey) {
        return true;
      }
      return currentView.integrationKey === integrationKey;
    })
    .map(({ activationId, integrationKey }) => ({
      label: integrationsListMap[integrationKey].title,
      value: activationId,
    }));

  const [formValues, setFormValues] = useState<Partial<IActionInstance>>({});

  const implementations = useIntegrationImplementationsList(
    activatedActions.find(
      ({ activationId }) => formValues.activatedActionId === activationId
    )?.integrationKey
  );

  const currentActionTitle =
    integrationsListMap[
      activatedActions.find(
        ({ activationId }) => formValues.activatedActionId === activationId
      )?.integrationKey
    ]?.title;

  const selectedImplementation = Object.fromEntries(
    Object.entries(
      (implementations.data || []).find(
        ({ key }) => key === formValues.implementationKey
      )?.configurationSchema || {}
    ).map(([key, value]) => [
      `${CONFIGURATION_FORM_PREFIX}${key}`,
      { ...value, label: `${currentActionTitle}: ${key}` },
    ])
  );

  const fields: IAppliedSchemaFormConfig<any> = {
    formAction: {
      label: "Trigger",
      type: "selection",
      selections: [
        {
          label: "Create",
          value: BaseAction.Create,
        },
        {
          label: "Update",
          value: BaseAction.Update,
        },
        {
          label: "Delete",
          value: BaseAction.Delete,
        },
      ],
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    entity: {
      type: "selection",
      validations: [{ validationType: "required" }],
      selections: entities,
    },
    activatedActionId: {
      label: "Integration",
      selections: activatedOptions,
      type: "selection",
      validations: [{ validationType: "required" }],
    },
    implementationKey: {
      label: "Action",
      type: "selection",
      validations: [{ validationType: "required" }],
      selections: (implementations.data || []).map(({ key, label }) => ({
        label,
        value: key,
      })),
    },
    ...selectedImplementation,
    // TODO
    // triggerLogic: {
    //   type: "json",
    //   validations: [],
    // },
  };
  if (currentView.entity) {
    delete fields.entity;
    initialValues = { ...initialValues, entity: currentView.entity };
  }
  if (currentView.integrationKey && activatedOptions.length === 1) {
    delete fields.activatedActionId;
    initialValues = {
      ...initialValues,
      activatedActionId: activatedOptions[0].value,
    };
  }

  const initialValues$1 = Object.entries(
    initialValues.configuration || {}
  ).reduce((values, [key, value]) => {
    return { ...values, [`${CONFIGURATION_FORM_PREFIX}${key}`]: value };
  }, initialValues);

  return (
    <SchemaForm<IActionInstance>
      buttonText="Save"
      initialValues={initialValues$1}
      fields={fields}
      onChange={setFormValues}
      action={formAction}
      onSubmit={async (instance) => {
        const integrationKey = activatedActions.find(
          ({ activationId }) => instance.activatedActionId === activationId
        )?.integrationKey;

        const cleanedConfigurationForm = Object.entries(instance).reduce(
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
        ) as IActionInstance;

        await onSubmit({ ...cleanedConfigurationForm, integrationKey });
      }}
      formExtension={{
        fieldsState: `
            return {
                entity: {
                    hidden: $.action === "update"
                },
                activatedActionId: {
                    hidden: $.action === "update"
                }
            }
        `,
      }}
    />
  );
}
