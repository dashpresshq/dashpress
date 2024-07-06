import { msg } from "@lingui/macro";
import { useDomainMessages } from "frontend/lib/crud-config";
import { LANG_DOMAINS } from "frontend/lib/crud-config/lang-domains";
import { useEffect, useState } from "react";
import type { ISchemaFormConfig } from "shared/form-schemas/types";
import type { IStorageIntegration } from "shared/types/actions";
import { fakeMessageDescriptor } from "translations/fake";

import { SchemaForm } from "@/components/app/form/schema";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "@/components/app/skeleton/form";
import { useToastActionQueryError } from "@/components/app/toast/error";
import { ViewStateMachine } from "@/components/app/view-state-machine";

import { PasswordToReveal } from "../Password";
import {
  useActivateStorageMutation,
  useActiveStorageIntegration,
  useStorageCredentialsConfiguration,
  useStorageIntegrationsList,
} from "./storage.store";

export function StorageCredentialsSettings() {
  const storageList = useStorageIntegrationsList();
  const activeStorageIntegration = useActiveStorageIntegration();
  const fileStorageDomainMessages = useDomainMessages(
    LANG_DOMAINS.INTEGRATIONS.FILE_STORAGE
  );

  const activateStorageMutation = useActivateStorageMutation();
  const storageCredentialsConfiguration = useStorageCredentialsConfiguration();

  const [currentStorage, setCurrentStorage] = useState("");

  const currentStorageDetails: IStorageIntegration | undefined =
    storageList.data.find((datum) => datum.key === currentStorage);

  useEffect(() => {
    setCurrentStorage(activeStorageIntegration.data.data);
  }, [activeStorageIntegration.data]);

  useToastActionQueryError(storageCredentialsConfiguration.error);

  const storageFormConfig: ISchemaFormConfig<{}> = {
    label: msg`Storage Key`,
    type: "text",
    selections: storageList.data.map((datum) => ({
      label: fakeMessageDescriptor(datum.title),
      value: datum.key,
    })),
    onChange: setCurrentStorage,
    validations: [
      {
        validationType: "required",
        errorMessage: msg`Required`,
      },
    ],
  };

  return (
    <ViewStateMachine
      loading={storageList.isLoading || activeStorageIntegration.isLoading}
      error={storageList.error || activeStorageIntegration.error}
      loader={
        <FormSkeleton
          schema={[
            FormSkeletonSchema.Input,
            FormSkeletonSchema.Input,
            FormSkeletonSchema.Input,
            FormSkeletonSchema.Input,
          ]}
        />
      }
    >
      {storageCredentialsConfiguration.data === undefined ? (
        <PasswordToReveal
          isLoading={storageCredentialsConfiguration.isLoading}
        />
      ) : (
        <SchemaForm<{ storageKey: string }>
          fields={{
            storageKey: storageFormConfig,
            ...(currentStorageDetails?.configurationSchema || {}),
          }}
          onSubmit={async ({ storageKey, ...data }) =>
            await activateStorageMutation.mutateAsync({
              storageKey,
              configuration: data as Record<string, string>,
            })
          }
          initialValues={{
            ...(storageCredentialsConfiguration.data || {}),
            storageKey: currentStorage,
          }}
          buttonText={fileStorageDomainMessages.FORM_LANG.UPSERT}
          systemIcon="Save"
        />
      )}
    </ViewStateMachine>
  );
}
