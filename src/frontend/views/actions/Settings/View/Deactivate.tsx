import { Stack, Text, Spacer } from "@hadmean/chromista";
import { HTTP_INTEGRATION_KEY, IIntegrationsList } from "shared/types/actions";
import { SchemaForm } from "frontend/components/SchemaForm";
import { useDeactivateActionMutation } from "../../actions.store";

interface IProps {
  integrationDetail: IIntegrationsList;
  activationId: string;
}

export function Deactivate({ integrationDetail, activationId }: IProps) {
  const deactivateActionMutation = useDeactivateActionMutation();

  const deactivationKey = `DEACTIVATE_${integrationDetail.key}`.toUpperCase();

  if (integrationDetail.key === HTTP_INTEGRATION_KEY) {
    return (
      <Stack justify="center">
        <Text textStyle="italic" size="5">
          The HTTP action can not be deactivated
        </Text>
      </Stack>
    );
  }

  return (
    <>
      <Text textStyle="italic" size="5">
        Deactivating an action will irrevocabily delete its configurations and
        remove all its instances
      </Text>
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
        buttonText={`Deactivate ${integrationDetail.title}`}
      />
    </>
  );
}
