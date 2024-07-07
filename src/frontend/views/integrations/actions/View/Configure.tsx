import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";

import { SchemaForm } from "@/components/app/form/schema";
import { useToastActionQueryError } from "@/components/app/toast/error";
import { useDomainMessages } from "@/frontend/lib/crud-config";
import { LANG_DOMAINS } from "@/frontend/lib/crud-config/lang-domains";
import { typescriptSafeObjectDotKeys } from "@/shared/lib/objects";
import type { IIntegrationsList } from "@/shared/types/actions";

import { PasswordMessage, PasswordToReveal } from "../../Password";
import {
  useActivationConfiguration,
  useUpdateActivatedIntegrationMutation,
} from "../actions.store";

interface IProps {
  integrationDetail: IIntegrationsList;
  activationId: string;
}

export function Configure({ activationId, integrationDetail }: IProps) {
  const updateActivatedIntegrationMutation =
    useUpdateActivatedIntegrationMutation(activationId);
  const activationConfiguration = useActivationConfiguration(activationId);
  const domainMessages = useDomainMessages(LANG_DOMAINS.INTEGRATIONS.ACTIONS);
  const { _ } = useLingui();

  useToastActionQueryError(activationConfiguration.error);

  if (
    typescriptSafeObjectDotKeys(integrationDetail.configurationSchema)
      .length === 0
  ) {
    return (
      <div className="text-center">
        <p className="text-sm">
          {_(msg`This action does not have configuration`)}
        </p>
      </div>
    );
  }

  if (activationConfiguration.data === undefined) {
    return <PasswordToReveal isLoading={activationConfiguration.isLoading} />;
  }
  return (
    <div className="flex flex-col gap-3">
      <PasswordMessage />

      <SchemaForm
        fields={integrationDetail.configurationSchema}
        onSubmit={updateActivatedIntegrationMutation.mutateAsync}
        initialValues={activationConfiguration.data || {}}
        buttonText={domainMessages.FORM_LANG.UPDATE}
        systemIcon="Save"
      />
    </div>
  );
}
