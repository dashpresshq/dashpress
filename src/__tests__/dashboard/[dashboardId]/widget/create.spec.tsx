import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CreateDashboardWidget from "@/pages/dashboard/[dashboardId]/widget/create";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import { closeAllToasts, getToastMessage, selectCombobox } from "@/tests/utils";

setupApiHandlers();

jest.mock("nanoid", () => ({
  nanoid: jest
    .fn()
    .mockReturnValueOnce("new_id_1")
    .mockReturnValueOnce("new_id_2"),
}));

describe("pages/dashboard/[dashboardId]/widget/create", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          dashboardId: "test-dashboard-id",
        },
      })
    );
  });

  it("should create summary widget", async () => {
    render(
      <TestProviders>
        <CreateDashboardWidget />
      </TestProviders>
    );

    await userEvent.type(
      await screen.findByLabelText("Title"),
      "New Summary Card"
    );

    await selectCombobox("Type", "Summary Card");

    await selectCombobox("Link Entity", "Plural entity-1");

    await selectCombobox("Width", "3 Units");

    await selectCombobox("Height", "4 Units");

    await selectCombobox("Entity Tab", "Verified Entity View");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    await userEvent.click(screen.getByRole("button", { name: "green" }));

    await selectCombobox("Icon", "Download");

    await userEvent.click(
      screen.getByRole("button", { name: "Create Dashboard Widget" })
    );

    expect(await getToastMessage()).toBe(
      "Dashboard Widget Created Successfully"
    );

    await closeAllToasts();
  });

  it("should create table widget", async () => {
    render(
      <TestProviders>
        <CreateDashboardWidget />
      </TestProviders>
    );

    await userEvent.type(await screen.findByLabelText("Title"), "New Table");

    await selectCombobox("Type", "Table");

    await selectCombobox("Link Entity", "Plural entity-1");

    await selectCombobox("Width", "2 Units");

    await selectCombobox("Entity Tab", "User Entity View");

    await selectCombobox("Height", "3 Units");

    await userEvent.type(screen.getByLabelText("Script"), "return 2");

    expect(
      screen.queryByRole("button", { name: "green" })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("combobox", { name: "Icon" })
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Create Dashboard Widget" })
    );

    expect(await getToastMessage()).toBe(
      "Dashboard Widget Created Successfully"
    );
  });
});
