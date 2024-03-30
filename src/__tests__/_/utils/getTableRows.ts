import { within } from "@testing-library/react";

export const getTableRows = async (widget: HTMLElement) => {
  const rows = await within(widget).findAllByRole("row");

  return rows.map((row, index) => {
    return within(row)
      .getAllByRole(index === 0 ? "columnheader" : "cell")
      .map((cell) => cell.textContent.trim())
      .filter(Boolean)
      .join("|");
  });
};
