import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import CreateDashboardWidget from "pages/dashboard/[dashboardId]/widget/create";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { closeAllToasts } from "__tests__/_/utils/closeAllToasts";

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
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        dashboardId: "test-dashboard-id",
      },
      isReady: true,
    }));
  });

  it("should create summary widget", async () => {
    render(
      <ApplicationRoot>
        <CreateDashboardWidget />
      </ApplicationRoot>
    );

    await userEvent.type(
      await screen.findByLabelText("Title"),
      "New Summary Card"
    );

    await userEvent.type(screen.getByLabelText("Type"), "Summary Card");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getByLabelText("Link Entity"),
      "Plural entity-1"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      await screen.findByLabelText("Entity Tab"),
      "Verified Entity View"
    );

    await userEvent.type(screen.getByLabelText("Color"), "green");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Icon"), "Download");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    await userEvent.type(screen.getByLabelText("Width"), "3 Units");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Height"), "4 Units");
    await userEvent.keyboard("{Enter}");

    await userEvent.click(
      screen.getByRole("button", { name: "Create Dashboard Widget" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Dashboard Widget Created Successfully"
    );

    await closeAllToasts();
  });

  it("should create table widget", async () => {
    render(
      <ApplicationRoot>
        <CreateDashboardWidget />
      </ApplicationRoot>
    );

    await userEvent.type(await screen.findByLabelText("Title"), "New Table");

    await userEvent.type(screen.getByLabelText("Type"), "Table");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getByLabelText("Link Entity"),
      "Plural entity-1"
    );
    await userEvent.keyboard("{Enter}");

    await userEvent.type(
      screen.getByLabelText("Entity Tab"),
      "Verified Entity View"
    );

    await userEvent.type(screen.getByLabelText("Width"), "2 Units");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Height"), "3 Units");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    expect(screen.queryByLabelText("Color")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Icon")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Create Dashboard Widget" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Dashboard Widget Created Successfully"
    );
  });
});
