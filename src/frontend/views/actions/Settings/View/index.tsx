import { SchemaForm } from "frontend/lib/form/SchemaForm";
import { Tabs, Text } from "@hadmean/chromista";
import { IActionsList, IActivatedAction } from "shared/types/actions";
import { useEffect } from "react";
import { ToastService } from "@hadmean/protozoa";
import {
  useActivateActionMutation,
  useActivationConfiguration,
} from "../../actions.store";
import { Instances } from "./Instances";
import { Deactivate } from "./Deactivate";
import { Configure } from "./Configure";

interface IProps {
  actionDetails?: IActionsList;
  activeAction?: IActivatedAction;
}

export function ActionSettingsView({ actionDetails, activeAction }: IProps) {
  const activateActionMutation = useActivateActionMutation(actionDetails?.key);
  const activationConfiguration = useActivationConfiguration(
    activeAction?.activationId
  );

  useEffect(() => {
    if (activationConfiguration.error) {
      ToastService.error(activationConfiguration.error);
    }
  }, [activationConfiguration.error]);

  if (!actionDetails) {
    return <Text>404: Unknown Action</Text>;
  }

  if (!activeAction) {
    return (
      <SchemaForm
        fields={actionDetails.configurationSchema}
        onSubmit={activateActionMutation.mutateAsync}
        initialValues={{}}
        buttonText={`Activate ${actionDetails.title}`}
      />
    );
  }

  return (
    <Tabs
      contents={[
        {
          label: "Instances",
          content: <Instances />,
        },
        {
          label: "Configure",
          content: (
            <Configure
              activationId={activeAction.activationId}
              actionDetails={actionDetails}
            />
          ),
        },
        {
          label: "Deactivate",
          content: (
            <Deactivate
              activationId={activeAction.activationId}
              actionDetails={actionDetails}
            />
          ),
        },
      ]}
    />
  );
}
