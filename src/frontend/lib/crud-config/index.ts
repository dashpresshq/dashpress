import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { fakeMessageDescriptor } from "translations/fake";

import type { IDomainDiction } from "./types";

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

export const useDomainMessages = ({
  singular: singular$1,
  plural: plural$1,
}: IDomainDiction) => {
  const { _ } = useLingui();
  const singular = _(singular$1);
  const plural = _(plural$1);

  return {
    MUTATION_LANG: {
      CREATE: msg`${singular} Created Successfully`,
      EDIT: msg`${singular} Updated Successfully`,
      DELETE: msg`${singular} Deleted Successfully`,
      SAVED: msg`${singular} Saved Successfully`,
      CUSTOM: (actionDescriptor: MessageDescriptor) => {
        const action = _(actionDescriptor);
        return msg`${singular} ${action} Successfully`;
      },
      VIEW_DETAILS: msg`View Details`,
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
      DUPLICATE: msg`Duplicate ${singular}`,
      DETAILS: msg`${singular} Details`,
      SETTINGS: msg`${singular} Settings`,
      NOT_FOUND: CRUD_CONFIG_NOT_FOUND(singular),
      TITLE: fakeMessageDescriptor(plural),
      EMPTY_LIST: msg`No ${singular} Has Been Added Yet`,
      SINGULAR: fakeMessageDescriptor(singular),
    },
  };
};

export type ICrudConfig = ReturnType<typeof useDomainMessages>;
