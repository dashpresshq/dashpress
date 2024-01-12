import { SchemaForm } from "frontend/components/SchemaForm";
import { ActionIntegrationKeys, IIntegrationsList } from "shared/types/actions";
import { Typo } from "frontend/design-system/primitives/Typo";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Tabs } from "frontend/design-system/components/Tabs";
import { useActivateActionMutation } from "../actions.store";
import { Deactivate } from "./Deactivate";
import { Configure } from "./Configure";
import { PasswordMessage } from "../../Password";

interface IProps {
  integrationDetail?: IIntegrationsList;
  activeAction?: ActionIntegrationKeys;
}

export function ActionSettingsView({
  integrationDetail,
  activeAction,
}: IProps) {
  const activateActionMutation = useActivateActionMutation(
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
          onSubmit={activateActionMutation.mutateAsync}
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
