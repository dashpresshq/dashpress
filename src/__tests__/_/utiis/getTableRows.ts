import { within } from "@testing-library/react";

export const getTableRows = async (widget: HTMLElement) => {
  const allRoles = await within(widget).findAllByRole("row");

  return allRoles.map((row) => row.textContent);
};
