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
      CREATE: `${singular} Created Successfully`,
      EDIT: `${singular} Updated Successfully`,
      DELETE: `${singular} Deleted Successfully`,
      SAVED: `${singular} Saved Successfully`,
      VIEW_DETAILS: `Click here to view ${singular.toLowerCase()}`,
    },
    FORM_LANG: {
      UPSERT: (submitting: boolean) =>
        `${submitting ? "Saving" : "Save"} ${singular}`,
      CREATE: (submitting: boolean) =>
        `${submitting ? "Creating" : "Create"} ${singular}`,
      UPDATE: (submitting: boolean) =>
        `${submitting ? "Updating" : "Update"} ${singular}`,
    },
    TEXT_LANG: {
      CREATE: `Add New ${singular}`,
      EDIT: `Edit ${singular}`,
      DETAILS: `${singular} Details`,
      NOT_FOUND: `${singular} could not be retrieved`,
      TITLE: `${plural}`,
      EMPTY_LIST: `No ${singular} Has Been Added Yet`,
    },
  };
};

export type ICrudConfig = ReturnType<typeof MAKE_CRUD_CONFIG>;

// TO NUKE
// MutationsLang
// ButtonLang
// dataNotFoundMessage
// TitleLang
