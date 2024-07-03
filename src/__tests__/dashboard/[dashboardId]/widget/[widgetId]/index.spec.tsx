import { render, screen } from "@testing-library/react";

import UpdateDashboardWidget from "pages/dashboard/[dashboardId]/widget/[widgetId]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { closeAllToasts, expectToast } from "__tests__/_/utils/closeAllToasts";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";

setupApiHandlers();

describe("pages/dashboard/[dashboardId]/widget/[widgetId]/index", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should update summary widget", async () => {
    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          dashboardId: "test-dashboard-id",
          widgetId: "summary_card_id_1",
        },
      })
    );

    render(
      <TestProviders>
        <UpdateDashboardWidget />
      </TestProviders>
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
      await screen.findByLabelText("Entity Tab"),
      "User Entity View"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Color"), "red");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("SVG"), "<p>Custom Icon</p>");

    await userEvent.type(screen.getByLabelText("Width"), "3 Units");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Height"), "4 Units");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    await userEvent.click(
      screen.getByRole("button", { name: "Update Dashboard Widget" })
    );

    await expectToast("Dashboard Widget Updated Successfully");

    await closeAllToasts();
  });

  it("should update table widget", async () => {
    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          dashboardId: "test-dashboard-id",
          widgetId: "table_id_1",
        },
      })
    );

    render(
      <TestProviders>
        <UpdateDashboardWidget />
      </TestProviders>
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

    await userEvent.type(screen.getByLabelText("Width"), "1 Unit");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Height"), "2 Units");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    await userEvent.click(
      screen.getByRole("button", { name: "Update Dashboard Widget" })
    );

    await expectToast("Dashboard Widget Updated Successfully");
  });

  it("should render error when widget is not present", async () => {
    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          dashboardId: "test-dashboard-id",
          widgetId: "invalid-widget-id",
        },
      })
    );

    render(
      <TestProviders>
        <UpdateDashboardWidget />
      </TestProviders>
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      `Widget with id 'invalid-widget-id' not found`
    );
    expect(screen.queryByLabelText("Title")).not.toBeInTheDocument();
  });
});
