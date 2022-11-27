/* eslint-disable no-param-reassign */
import { IValueLabel } from "@hadmean/chromista/dist/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import {
  IActionInstance,
  IIntegrationsList,
  IActivatedAction,
} from "shared/types/actions";

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

// performKey: string;
// configuration: Record<string, string>;

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

  const fields: IAppliedSchemaFormConfig<any> = {
    formAction: {
      type: "selection",
      selections: [
        {
          label: "Create",
          value: "create",
        },
        {
          label: "Update",
          value: "update",
        },
      ],
      validations: [
        {
          validationType: "required",
        },
      ],
    },
    activatedActionId: {
      selections: activatedOptions,
      type: "selection",
      validations: [{ validationType: "required" }],
    },
    entity: {
      type: "selection",
      validations: [{ validationType: "required" }],
      selections: entities,
    },
    triggerLogic: {
      type: "json",
      validations: [],
    },
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
  return (
    <SchemaForm<IActionInstance>
      buttonText="Save"
      initialValues={initialValues}
      fields={fields}
      action={formAction}
      onSubmit={async (instance) => {
        const integrationKey = activatedActions.find(
          ({ activationId }) => instance.activatedActionId === activationId
        )?.integrationKey;
        await onSubmit({ ...instance, integrationKey });
      }}
      formExtension={{
        fieldsState: `
            return {
                entity: {
                    hidden: $.action === "update"
                },
                //: eyes
                activatedActionId: {
                    hidden: $.action === "update"
                }
            }
        `,
      }}
    />
  );
}
