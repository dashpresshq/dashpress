import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { Tabs, Text } from "@hadmean/chromista";
import { IActionsList } from "shared/types/actions";
import { useActivateActionMutation } from "../actions.store";

interface IProps {
  currentAction: IActionsList | undefined;
  currentKey: string;
  isActionActive: boolean;
}

export function ActionSettingsView({
  currentAction,
  isActionActive,
  currentKey,
}: IProps) {
  const activateActionMutation = useActivateActionMutation(currentKey);

  if (!currentAction) {
    return <Text>404: Unknown Action</Text>;
  }
  if (!isActionActive) {
    return (
      <SchemaForm
        fields={currentAction.configurationSchema}
        onSubmit={activateActionMutation.mutateAsync}
        initialValues={{}}
        buttonText="Activate Action"
      />
    );
  }
  return (
    <Tabs
      contents={[
        {
          label: "Usages",
          content: <>Usages</>,
        },
        {
          label: "Configure",
          content: (
            // Your Password to view the configuration
            <SchemaForm
              fields={currentAction.configurationSchema}
              onSubmit={activateActionMutation.mutateAsync}
              initialValues={{}}
              buttonText="Update Configuration"
            />
          ),
        },
        {
          label: "Deactivate",
          content: <>Some Red Button and can not Deactivate HTTP</>,
        },
      ]}
    />
  );
}
