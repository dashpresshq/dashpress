import { IValueLabel } from "@hadmean/chromista/dist/types";
import { SchemaForm } from "frontend/lib/form/SchemaForm";
import noop from "lodash/noop";
import { IAppliedSchemaFormConfig } from "shared/form-schemas/types";
import { IActionInstance } from "shared/types/actions";

interface IProps {
  onSubmit: (instance: IActionInstance) => Promise<void>;
  initialValues?: IActionInstance;
  entities: IValueLabel[];
  currentView: {
    entity?: string;
    integrationKey?: string;
  };
}

// integrationKey: string;
// activatedActionId: string;

// entity: string;

// performKey: string;
// configuration: Record<string, string>;

export function ActionForm({
  onSubmit,
  initialValues,
  entities,
  currentView,
}: IProps) {
  noop(currentView);
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
    triggerLogic: {
      type: "json",
      validations: [],
    },
    entity: {
      type: "selection",
      validations: [{ validationType: "required" }],
      selections: entities,
    },
  };
  return (
    <SchemaForm<IActionInstance>
      buttonText="Save"
      initialValues={initialValues}
      fields={fields}
      onSubmit={onSubmit}
      formExtension={{
        fieldsState: `
            return {
                entity: {
                    hidden: ""
                }
            }
        `,
      }}
    />
  );
}
