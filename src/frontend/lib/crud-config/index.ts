import { t } from "@lingui/macro";

export const CRUD_CONFIG_NOT_FOUND = (singular: string) =>
  t`${singular} could not be retrieved`;

export const MAKE_CRUD_CONFIG = ({
  path,
  singular,
  plural,
}: {
  path: string;
  singular: string;
  plural: string;
}) => {
  return {
    ENDPOINTS: {
      LIST: `${path}`,
      CREATE: `${path}`,
      DETAILS: (id: string) => `${path}/${id}`,
      DELETE: (id: string) => `${path}/${id}`,
      UPDATE: (id: string) => `${path}/${id}`,
      CUSTOM: (id: string, customPath: string) => `${path}/${id}/${customPath}`,
    },
    MUTATION_LANG: {
      CREATE: t`${singular} Created Successfully`,
      EDIT: t`${singular} Updated Successfully`,
      DELETE: t`${singular} Deleted Successfully`,
      SAVED: t`${singular} Saved Successfully`,
      CUSTOM: (action: string) => t`${singular} ${action} Successfully`,
      VIEW_DETAILS: t`Click here to view ${singular.toLowerCase()}`,
    },
    FORM_LANG: {
      UPSERT: (submitting: boolean) =>
        `${submitting ? t`Saving` : t`Save`} ${singular}`,
      CREATE: (submitting: boolean) =>
        `${submitting ? t`Creating` : t`Create`} ${singular}`,
      UPDATE: (submitting: boolean) =>
        `${submitting ? t`Updating` : t`Update`} ${singular}`,
    },
    TEXT_LANG: {
      CREATE: t`Add New ${singular}`,
      MANAGE: t`Manage ${plural}`,
      DELETE: t`Delete ${singular}`,
      EDIT: t`Edit ${singular}`,
      DETAILS: t`${singular} Details`,
      NOT_FOUND: CRUD_CONFIG_NOT_FOUND(singular),
      TITLE: `${plural}`,
      EMPTY_LIST: t`No ${singular} Has Been Added Yet`,
      SINGULAR: `${singular}`,
    },
  };
};

export type ICrudConfig = ReturnType<typeof MAKE_CRUD_CONFIG>;
