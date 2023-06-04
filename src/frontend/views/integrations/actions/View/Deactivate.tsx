import { Stack, Typo, Spacer } from "@hadmean/chromista";
import { ActionIntegrationKeys, IIntegrationsList } from "shared/types/actions";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useDeactivateActionMutation } from "../actions.store";

interface IProps {
  integrationDetail: IIntegrationsList;
  activationId: string;
}

export function Deactivate({ integrationDetail, activationId }: IProps) {
  const deactivateActionMutation = useDeactivateActionMutation();

  const deactivationKey = `DEACTIVATE_${integrationDetail.key}`.toUpperCase();

  if (integrationDetail.key === ActionIntegrationKeys.HTTP) {
    return (
      <Stack justify="center">
        <Typo.SM textStyle="italic">
          The HTTP action can not be deactivated
        </Typo.SM>
      </Stack>
    );
  }

  return (
    <>
      <Typo.SM textStyle="italic">
        Deactivating an action will irrevocabily delete its configurations and
        remove all its instances
      </Typo.SM>
      <Spacer />
      <SchemaForm
        fields={{
          confirm: {
            type: "text",
            label: `Input ${deactivationKey} to continue`,
            validations: [
              {
                validationType: "regex",
                constraint: {
                  pattern: `${deactivationKey}$`,
                },
                errorMessage: "Incorrect value",
              },
              {
                validationType: "required",
                errorMessage: "Required",
              },
            ],
          },
        }}
        onSubmit={() => deactivateActionMutation.mutateAsync(activationId)}
        buttonText={(isSubmitting) =>
          isSubmitting
            ? `Deactivating ${integrationDetail.title}`
            : `Deactivate ${integrationDetail.title}`
        }
        icon="no-icon"
      />
    </>
  );
}
