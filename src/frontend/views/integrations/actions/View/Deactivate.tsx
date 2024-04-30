import { ActionIntegrations, IIntegrationsList } from "shared/types/actions";
import { SchemaForm } from "frontend/components/SchemaForm";
import { Stack } from "frontend/design-system/primitives/Stack";
import { Spacer } from "frontend/design-system/primitives/Spacer";
import { Typo } from "frontend/design-system/primitives/Typo";
import { msg } from "@lingui/macro";
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
      <Stack $justify="center">
        <Typo.SM $textStyle="italic">
          The HTTP action can not be deactivated
        </Typo.SM>
      </Stack>
    );
  }

  return (
    <>
      <Typo.SM $textStyle="italic">
        Deactivating an integration will irrevocabily delete its configurations
        and remove all its form actions
      </Typo.SM>
      <Spacer />
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
