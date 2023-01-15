import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/admin/settings/dashboard";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(() => ({
  asPath: "/",
  query: {},
}));

jest.mock("nanoid", () => ({
  nanoid: jest.fn().mockReturnValueOnce("new_id_1").mockReturnValueOnce("2"),
}));

describe("pages/admin/settings/dashboard", () => {
  describe("Summary Card", () => {
    it("should create summary card widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await userEvent.click(
        screen.getByRole("button", { name: "New Dashboard Item" })
      );

      const dialog = screen.getByRole("dialog");

      expect(
        within(dialog).getByText("New Dashboard Item")
      ).toBeInTheDocument();

      await userEvent.type(
        await within(dialog).findByLabelText("Title"),
        "New Summary Card"
      );

      await userEvent.type(
        within(dialog).getByLabelText("Entity"),
        "Plural entity-1"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Type"),
        "Summary Card"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(within(dialog).getByLabelText("Color"), "green");
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("SVG"),
        "<p>Demo SVG</p>"
      );

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Save" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Widget Created Successfully"
      );
    });

    it("should show the new summary card widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Summary Card Widget");

      expect(
        await within(widget).findByText("New Summary Card")
      ).toBeInTheDocument();
      expect(within(widget).getByText("Demo SVG")).toBeInTheDocument();
      expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
        "8"
      );
    });
  });

  describe("Action Button", () => {
    it("should go to home page on 'Done'", async () => {
      const replaceMock = jest.fn();
      useRouter.mockImplementation(() => ({
        replace: replaceMock,
        query: {},
      }));

      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await userEvent.click(screen.getByRole("button", { name: "Done" }));

      expect(replaceMock).toHaveBeenCalledWith("/admin");
    });
  });

  // Should create table widget
  // Should delete card and table
  // Should update card and table
  // Should re-arrange card and table
});
