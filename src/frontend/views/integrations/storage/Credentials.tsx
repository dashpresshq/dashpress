import { SchemaForm } from "frontend/components/SchemaForm";
import { useEffect, useState } from "react";
import { ToastService } from "frontend/lib/toast";
import { ViewStateMachine } from "frontend/components/ViewStateMachine";
import {
  FormSkeleton,
  FormSkeletonSchema,
} from "frontend/design-system/components/Skeleton/Form";
import { ISchemaFormConfig } from "shared/form-schemas/types";
import { noop } from "shared/lib/noop";
import { IStorageIntegration } from "shared/types/actions";
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
    type: "text",
    selections: storageList.data.map((datum) => ({
      label: datum.title,
      value: datum.key,
    })),
    validations: [
      {
        validationType: "required",
        errorMessage: "Required",
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
        <>
          <SchemaForm<{ storageKey: string }>
            fields={{
              storageKey: storageFormConfig,
            }}
            onSubmit={async () => noop()}
            initialValues={{
              storageKey: currentStorage,
            }}
            buttonText={null}
            systemIcon="Save"
          />
          <PasswordToReveal
            label={`${STORAGE_INTEGRATIONS_CRUD_CONFIG.TEXT_LANG.TITLE} Configuration`}
            isLoading={storageCredentialsConfiguration.isLoading}
          />
        </>
      ) : (
        <SchemaForm<{ storageKey: string }>
          onChange={(data) => {
            setCurrentStorage(data.storageKey);
          }}
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
