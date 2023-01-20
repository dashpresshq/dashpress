import { within } from "@testing-library/react";

export const getTableRows = async (widget: HTMLElement) => {
  const allRoles = await within(widget).findAllByRole("row");

  return allRoles.map((row) =>
    row.textContent
      .replace("-06T23:00:00.000Z", "")
      .replace("-07T00:00:00.000Z", "")
  );
};
