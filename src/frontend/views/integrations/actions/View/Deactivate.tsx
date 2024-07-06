import { msg } from "@lingui/macro";
import type { IIntegrationsList } from "shared/types/actions";
import { ActionIntegrations } from "shared/types/actions";

import { SchemaForm } from "@/components/app/form/schema";

import { useDeactivateIntegrationMutation } from "../actions.store";

interface IProps {
  integrationDetail: IIntegrationsList;
  activationId: string;
}

export function Deactivate({ integrationDetail, activationId }: IProps) {
  const deactivateIntegrationMutation = useDeactivateIntegrationMutation();

  const deactivationKey = `DEACTIVATE_${integrationDetail.key}`.toUpperCase();

  if (integrationDetail.key === ActionIntegrations.HTTP) {
    return (
      <div className="text-center">
        <p className="text-sm italic">The HTTP action can not be deactivated</p>
      </div>
    );
  }

  return (
    <>
      <p className="mb-3 text-sm italic">
        Deactivating an integration will irrevocabily delete its configurations
        and remove all its form actions
      </p>
      <SchemaForm
        fields={{
          confirm: {
            type: "text",
            label: msg`Input ${deactivationKey} to continue`,
            validations: [
              {
                validationType: "regex",
                constraint: {
                  pattern: `${deactivationKey}$`,
                },
                errorMessage: msg`Incorrect value`,
              },
              {
                validationType: "required",
                errorMessage: msg`Required`,
              },
            ],
          },
        }}
        onSubmit={() => deactivateIntegrationMutation.mutateAsync(activationId)}
        buttonText={(isSubmitting) =>
          isSubmitting
            ? msg`Deactivating ${integrationDetail.title}`
            : msg`Deactivate ${integrationDetail.title}`
        }
        systemIcon="Ban"
      />
    </>
  );
}
