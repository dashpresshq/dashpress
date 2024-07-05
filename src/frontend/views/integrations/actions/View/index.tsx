import type {
  ActionIntegrations,
  IIntegrationsList,
} from "shared/types/actions";
import { msg } from "@lingui/macro";
import { SchemaForm } from "@/components/app/form/schema";
import { Tabs } from "@/components/app/tabs";
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
    return <p>404: Unknown Action</p>;
  }

  if (!activeAction) {
    return (
      <div className="flex flex-col gap-3">
        <PasswordMessage />
        <SchemaForm
          fields={integrationDetail.configurationSchema}
          onSubmit={activateIntegrationMutation.mutateAsync}
          initialValues={{}}
          systemIcon="Unlock"
          buttonText={(isSubmitting) =>
            isSubmitting
              ? msg`Activating ${integrationDetail.title}`
              : msg`Activate ${integrationDetail.title}`
          }
        />
      </div>
    );
  }

  return (
    <Tabs
      contents={[
        {
          label: msg`Configure`,
          id: "configure",
          content: (
            <Configure
              activationId={activeAction}
              integrationDetail={integrationDetail}
            />
          ),
        },
        {
          label: msg`Deactivate`,
          id: "deactivate",
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
