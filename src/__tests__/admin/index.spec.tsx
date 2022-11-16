import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import Dashboard from "pages/admin";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("pages/admin", () => {
  it("should render table dashboard widget correctly", async () => {
    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    const firstWidget = await screen.findByTestId("widget__table_id_1");

    expect(
      await within(firstWidget).findByText("Table Widget 1")
    ).toBeInTheDocument();

    const allRoles = await within(firstWidget).findAllByRole("row");

    expect(allRoles.map((row) => row.textContent.replace("23:00:00.000", "")))
      .toMatchInlineSnapshot(`
      [
        "Entity 1 Field 1Entity 1 Field 2Entity 1 Field 3Entity 1 Field 4Entity 1 Field 5Entity 1 Field 6Entity 1 Field 7",
        "12hello342022-05-06TZfoo",
        "23there212021-05-06TZfoo",
        "32today182022-02-06TZbar",
      ]
    `);
  });

  it("should render summary card widget correctly", async () => {
    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    const secondWidget = await screen.findByTestId("widget__summary_card_id_1");

    expect(
      await within(secondWidget).findByText("Summary Widget 1")
    ).toBeInTheDocument();
    expect(
      await within(secondWidget).findByText("Some SVG Here")
    ).toBeInTheDocument();
    expect(await within(secondWidget).findByText("8")).toBeInTheDocument();
  });

  it("should render correct buttons for table widget", async () => {
    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    const widget = await screen.findByTestId("widget__table_id_1");

    expect(within(widget).getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/admin/entity-1"
    );
    expect(
      within(widget).queryByRole("button", { name: "Delete Button" })
    ).not.toBeInTheDocument();
    expect(
      within(widget).queryByRole("button", { name: "Edit Widget" })
    ).not.toBeInTheDocument();
  });

  it("should render correct buttons for summary card widget", async () => {
    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    const widget = await screen.findByTestId("widget__summary_card_id_1");

    expect(within(widget).getByRole("link", { name: "View" })).toHaveAttribute(
      "href",
      "/admin/entity-1"
    );

    expect(
      within(widget).queryByRole("button", { name: "Delete Button" })
    ).not.toBeInTheDocument();
    expect(
      within(widget).queryByRole("button", { name: "Edit Widget" })
    ).not.toBeInTheDocument();
  });
});
