import { SchemaForm } from "frontend/components/SchemaForm";
import { ActionIntegrations, IIntegrationsList } from "shared/types/actions";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Tabs } from "frontend/design-system/components/Tabs";
import { useActivateIntegrationMutation } from "../actions.store";
import { Deactivate } from "./Deactivate";
import { Configure } from "./Configure";
import { PasswordMessage } from "../../Password";

interface IProps {
  integrationDetail?: IIntegrationsList;
  activeAction?: ActionIntegrations;
}

export function ActionSettingsView({
  integrationDetail,
  activeAction,
}: IProps) {
  const activateIntegrationMutation = useActivateIntegrationMutation(
    integrationDetail?.key
  );

  if (!integrationDetail) {
    return <Typo.MD>404: Unknown Action</Typo.MD>;
  }

  if (!activeAction) {
    return (
      <>
        <PasswordMessage />
        <Spacer />
        <SchemaForm
          fields={integrationDetail.configurationSchema}
          onSubmit={activateIntegrationMutation.mutateAsync}
          initialValues={{}}
          icon="no-icon"
          buttonText={(isSubmitting) =>
            isSubmitting
              ? `Activating ${integrationDetail.title}`
              : `Activate ${integrationDetail.title}`
          }
        />
      </>
    );
  }

  return (
    <Tabs
      contents={[
        {
          label: "Configure",
          content: (
            <Configure
              activationId={activeAction}
              integrationDetail={integrationDetail}
            />
          ),
        },
        {
          label: "Deactivate",
          content: (
            <Deactivate
              activationId={activeAction}
              integrationDetail={integrationDetail}
            />
          ),
        },
      ]}
    />
  );
}
