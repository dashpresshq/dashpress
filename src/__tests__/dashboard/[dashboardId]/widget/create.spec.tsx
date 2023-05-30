import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import CreateDashboardWidget from "pages/dashboard/[dashboardId]/widget/create";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";

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
    }));
  });

  it("should create summary widget", async () => {
    render(
      <AppWrapper>
        <CreateDashboardWidget />
      </AppWrapper>
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
      screen.getByLabelText("Entity Tab"),
      "Verified Entity View"
    );

    await userEvent.type(screen.getByLabelText("Color"), "green");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Icon"), "Download");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Script"), "return 1");

    expect(screen.queryByLabelText("Size")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Height")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Create Dashboard Widget" })
    );

    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Dashboard Widget Created Successfully"
    );
  });

  it("should create table widget", async () => {
    render(
      <AppWrapper>
        <CreateDashboardWidget />
      </AppWrapper>
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

    await userEvent.type(screen.getByLabelText("Size"), "Half");
    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Height"), "Medium");
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
