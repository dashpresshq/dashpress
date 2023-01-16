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

    const firstWidget = await screen.findByLabelText("Table Widget 1 Widget");

    expect(
      await within(firstWidget).findByText("Table Widget 1")
    ).toBeInTheDocument();

    const allRoles = await within(firstWidget).findAllByRole("row");

    expect(
      allRoles.map((row) =>
        row.textContent
          .replace("-06T23:00:00.000Z", "")
          .replace("-07T00:00:00.000Z", "")
      )
    ).toMatchInlineSnapshot(`
      [
        "Entity 1 Field 1Entity 1 Field 2Entity 1 Field 3Entity 1 Field 4Entity 1 Field 5Entity 1 Field 6Entity 1 Field 7",
        "12hello342022-05foo",
        "23there212021-05foo",
        "32today182022-02bar",
      ]
    `);
  });

  it("should render summary card widget correctly", async () => {
    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    const secondWidget = await screen.findByLabelText(
      "Summary Widget 1 Widget"
    );

    expect(
      await within(secondWidget).findByText("Summary Widget 1")
    ).toBeInTheDocument();
    expect(within(secondWidget).getByText("Some SVG Here")).toBeInTheDocument();
    expect(
      within(secondWidget).getByLabelText("Total Count")
    ).toHaveTextContent("8");
  });

  it("should render correct buttons for table widget", async () => {
    render(
      <AppWrapper>
        <Dashboard />
      </AppWrapper>
    );

    const widget = await screen.findByLabelText("Table Widget 1 Widget");

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

    const widget = await screen.findByLabelText("Summary Widget 1 Widget");

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
