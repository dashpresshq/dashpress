import { SchemaForm } from "frontend/components/SchemaForm";
import { useEffect, useState } from "react";
import { ToastService } from "frontend/lib/toast";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { ISchemaFormConfig } from "shared/form-schemas/types";
import { IStorageIntegration } from "shared/types/actions";
import { msg } from "@lingui/macro";
import { i18nNoop } from "translations/fake";
import { STORAGE_INTEGRATIONS_CRUD_CONFIG } from "./constants";
import {
  useActivateStorageMutation,
  useActiveStorageIntegration,
  useStorageCredentialsConfiguration,
  useStorageIntegrationsList,
} from "./storage.store";
import { PasswordToReveal } from "../Password";

export function StorageCredentialsSettings() {
  const storageList = useStorageIntegrationsList();
  const activeStorageIntegration = useActiveStorageIntegration();

  const activateStorageMutation = useActivateStorageMutation();
  const storageCredentialsConfiguration = useStorageCredentialsConfiguration();

  const [currentStorage, setCurrentStorage] = useState("");

  const currentStorageDetails: IStorageIntegration | undefined =
    storageList.data.find((datum) => datum.key === currentStorage);

  useEffect(() => {
    setCurrentStorage(activeStorageIntegration.data.data);
  }, [activeStorageIntegration.data]);

  useEffect(() => {
    if (storageCredentialsConfiguration.error) {
      ToastService.error(storageCredentialsConfiguration.error);
    }
  }, [storageCredentialsConfiguration.error]);

  const storageFormConfig: ISchemaFormConfig<{}> = {
    label: msg`Storage Key`,
    type: "text",
    selections: storageList.data.map((datum) => ({
      label: i18nNoop(datum.title),
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
          label={`${STORAGE_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.TITLE} Configuration`}
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
          buttonText={STORAGE_INTEGRATIONS_CRUD_CONFIG.FORM_LANG.UPSERT}
          systemIcon="Save"
        />
      )}
    </ViewStateMachine>
  );
}
