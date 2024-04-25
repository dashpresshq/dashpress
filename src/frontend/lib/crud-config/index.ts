import { MessageDescriptor, i18n } from "@lingui/core";
import { msg } from "@lingui/macro";

export const CRUD_CONFIG_NOT_FOUND = (singular: string) =>
  msg`${singular} could not be retrieved`;

export const MAKE_ENDPOINTS_CONFIG = (path: string) => ({
  LIST: `${path}`,
  CREATE: `${path}`,
  DETAILS: (id: string) => `${path}/${id}`,
  DELETE: (id: string) => `${path}/${id}`,
  UPDATE: (id: string) => `${path}/${id}`,
  CUSTOM: (id: string, customPath: string) => `${path}/${id}/${customPath}`,
});

export const MAKE_CRUD_CONFIG = ({
  singular: singular$1,
  plural: plural$1,
}: {
  singular: MessageDescriptor;
  plural: MessageDescriptor;
}) => {
  const singular = i18n._(singular$1);
  const plural = i18n._(plural$1);
  return {
    MUTATION_LANG: {
      CREATE: msg`${singular} Created Successfully`,
      EDIT: msg`${singular} Updated Successfully`,
      DELETE: msg`${singular} Deleted Successfully`,
      SAVED: msg`${singular} Saved Successfully`,
      CUSTOM: (action: string) => msg`${singular} ${action} Successfully`,
      VIEW_DETAILS: msg`Click here to view ${singular}`,
    },
    FORM_LANG: {
      UPSERT: (submitting: boolean) =>
        submitting ? msg`Saving ${singular}` : msg`Save ${singular}`,
      CREATE: (submitting: boolean) =>
        submitting ? msg`Creating ${singular}` : msg`Create ${singular}`,
      UPDATE: (submitting: boolean) =>
        submitting ? msg`Updating ${singular}` : msg`Update ${singular}`,
    },
    TEXT_LANG: {
      CREATE: msg`Add New ${singular}`,
      MANAGE: msg`Manage ${plural}`,
      DELETE: msg`Delete ${singular}`,
      EDIT: msg`Edit ${singular}`,
      DETAILS: msg`${singular} Details`,
      SETTINGS: msg`${singular} Settings`,
      NOT_FOUND: CRUD_CONFIG_NOT_FOUND(singular),
      TITLE: msg`${plural}`,
      EMPTY_LIST: msg`No ${singular} Has Been Added Yet`,
      SINGULAR: msg`${singular}`,
    },
  };
};

export type ICrudConfig = ReturnType<typeof MAKE_CRUD_CONFIG>;
