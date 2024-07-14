import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UpdateDashboardWidget from "@/pages/dashboard/[dashboardId]/widget/[widgetId]/index";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import {
  closeAllToasts,
  getToastMessage,
  selectCombobox,
  waitForSkeletonsToVanish,
} from "@/tests/utils";

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

    await waitForSkeletonsToVanish();

    await userEvent.type(await screen.findByLabelText("Title"), "Updated");

    await selectCombobox("Type", "Summary Card");

    await selectCombobox("Link Entity", "Plural entity-2");

    await userEvent.click(screen.getByRole("button", { name: "red" }));

    await selectCombobox("Entity Tab", "User Entity View");

    await userEvent.type(screen.getByLabelText("SVG"), "<p>Custom Icon</p>");

    await selectCombobox("Width", "3 Units");

    await selectCombobox("Height", "4 Units");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    await userEvent.click(
      screen.getByRole("button", { name: "Update Dashboard Widget" })
    );

    expect(await getToastMessage()).toBe(
      "Dashboard Widget Updated Successfully"
    );

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

    await selectCombobox("Type", "Table");

    await selectCombobox("Link Entity", "Plural entity-2");

    await selectCombobox("Entity Tab", "Verified Entity View");

    await selectCombobox("Width", "1 Unit");

    await selectCombobox("Height", "2 Units");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    await userEvent.click(
      screen.getByRole("button", { name: "Update Dashboard Widget" })
    );

    expect(await getToastMessage()).toBe(
      "Dashboard Widget Updated Successfully"
    );
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
