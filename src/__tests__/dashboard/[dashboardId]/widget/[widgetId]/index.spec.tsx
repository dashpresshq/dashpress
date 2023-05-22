import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import UpdateDashboardWidget from "pages/dashboard/[dashboardId]/widget/[widgetId]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";

setupApiHandlers();

describe("pages/dashboard/[dashboardId]/widget/[widgetId]/index", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should update summary widget", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        dashboardId: "test-dashboard-id",
        widgetId: "summary_card_id_1",
      },
    }));

    render(
      <AppWrapper>
        <UpdateDashboardWidget />
      </AppWrapper>
    );

    await userEvent.type(await screen.findByLabelText("Title"), "Updated");

    await userEvent.type(screen.getByLabelText("Type"), "Summary Card");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getByLabelText("Link Entity"),
      "Plural entity-2"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getByLabelText("Entity Tab"),
      "User Entity View"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Color"), "red");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("SVG"), "<p>Custom Icon</p>");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    await userEvent.click(
      screen.getByRole("button", { name: "Update Widget" })
    );

    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Widget Updated Successfully"
    );
  });

  it("should update table widget", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        dashboardId: "test-dashboard-id",
        widgetId: "table_id_1",
      },
    }));

    render(
      <AppWrapper>
        <UpdateDashboardWidget />
      </AppWrapper>
    );

    await userEvent.type(await screen.findByLabelText("Title"), "Updated");

    await userEvent.type(screen.getByLabelText("Type"), "Table");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getByLabelText("Link Entity"),
      "Plural entity-2"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getByLabelText("Entity Tab"),
      "Verified Entity View"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Size"), "Full");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Height"), "Large");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    await userEvent.click(
      screen.getByRole("button", { name: "Update Widget" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Widget Updated Successfully"
    );
  });

  it("should render error when widget is not present", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        dashboardId: "test-dashboard-id",
        widgetId: "invalid-widget-id",
      },
    }));

    render(
      <AppWrapper>
        <UpdateDashboardWidget />
      </AppWrapper>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      `Widget with id 'invalid-widget-id' not found`
    );
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();
  });
});
