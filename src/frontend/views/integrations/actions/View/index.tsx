import { SchemaForm } from "frontend/components/SchemaForm";
import { Spacer, Tabs, Typo } from "@hadmean/chromista";
import { IIntegrationsList, IActivatedAction } from "shared/types/actions";
import { BaseActionInstances } from "frontend/views/entity/Actions/Base";
import { useActivateActionMutation } from "../actions.store";
import { Deactivate } from "./Deactivate";
import { Configure } from "./Configure";

interface IProps {
  integrationDetail?: IIntegrationsList;
  activeAction?: IActivatedAction;
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
        <Typo.SM textStyle="italic">
          All the values provided from this form will encrypted using
          `aes-256-gcm` before been saved.
        </Typo.SM>
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
          label: "Instances",
          content: (
            <BaseActionInstances integrationKey={activeAction.integrationKey} />
          ),
        },
        {
          label: "Configure",
          content: (
            <Configure
              activationId={activeAction.activationId}
              integrationDetail={integrationDetail}
            />
          ),
        },
        {
          label: "Deactivate",
          content: (
            <Deactivate
              activationId={activeAction.activationId}
              integrationDetail={integrationDetail}
            />
          ),
        },
      ]}
    />
  );
}
