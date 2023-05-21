import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/dashboard/manage";
import Dashboard from "pages";

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
        screen.getByRole("button", { name: "Add New Widget" })
      );

      const dialog = screen.getByRole("dialog");

      expect(within(dialog).getByText("Add New Widget")).toBeInTheDocument();

      await userEvent.type(
        await within(dialog).findByLabelText("Title"),
        "New Summary Card"
      );

      await userEvent.type(
        within(dialog).getByLabelText("Type"),
        "Summary Card"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Entity"),
        "Plural entity-1"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(within(dialog).getByLabelText("Color"), "green");
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Query"),
        "Verified Entity View"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Date Field"),
        "entity-1-date-field"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(within(dialog).getByLabelText("Icon"), "Download");

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
          <Dashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Summary Card Widget");

      expect(
        await within(widget).findByText("New Summary Card")
      ).toBeInTheDocument();
      expect(within(widget).getByLabelText("New Summary Card Icon").innerHTML)
        .toBe(`<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="none" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" stroke="currentColor" d="M10 21a1 1 0 11-2 0 1 1 0 012 0zM21 21a1 1 0 11-2 0 1 1 0 012 0zM1 1h4l2.68 13.39c.188.925.995 1.61 1.962 1.61h.04-.002H19.438a2 2 0 001.959-1.597l.002-.013 1.6-8.39h-17"></path>
              </svg>`);

      expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
        "1.52K"
      );
      expect(within(widget).getByLabelText("Relative Count")).toHaveTextContent(
        "55%"
      );
      expect(
        within(widget).getByLabelText("Relative Direction")
      ).toHaveAttribute("color", "#f5325c");

      expect(
        within(widget).getByLabelText("New Summary Card Icon")
      ).toHaveAttribute("color", "#00a05a");
      expect(
        within(widget).getByRole("link", { name: "View" })
      ).toHaveAttribute("href", "/admin/entity-1?tab=Verified%20Entity%20View");
    });

    it("should change relative time", async () => {
      render(
        <AppWrapper>
          <Dashboard />
        </AppWrapper>
      );

      await userEvent.click(
        screen.getAllByRole("button", {
          name: "Toggle Dropdown",
        })[1]
      );

      await userEvent.click(
        screen.getByRole("button", {
          name: "Past 3 Months",
        })
      );

      const widget = await screen.findByLabelText("New Summary Card Widget");

      expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
        "1.52K"
      );
      expect(within(widget).getByLabelText("Relative Count")).toHaveTextContent(
        "54%"
      );
      expect(
        within(widget).getByLabelText("Relative Direction")
        // :eyes #03d87f
      ).toHaveAttribute("color", "#f5325c");
    });

    it("should update summary card widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Summary Card Widget");

      await userEvent.click(
        within(widget).getByRole("button", { name: "Edit Widget" })
      );

      const dialog = screen.getByRole("dialog");

      expect(
        await within(dialog).findByText("Edit Dashboard Widget")
      ).toBeInTheDocument();

      await userEvent.type(
        await within(dialog).findByLabelText("Title"),
        " Updated"
      );

      await userEvent.type(
        within(dialog).getByLabelText("Entity"),
        "Plural entity-2"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Query"),
        "User Entity View"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Date Field"),
        "Select"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(within(dialog).getByLabelText("Color"), "red");
      await userEvent.keyboard("{Enter}");

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Use SVG" })
      );

      await userEvent.type(
        within(dialog).getByLabelText("SVG"),
        "<p>Custom Icon</p>"
      );

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Save" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Widget Updated Successfully"
      );
    });

    it("should show the updated summary card widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText(
        "New Summary Card Updated Widget"
      );

      expect(
        await within(widget).findByText("New Summary Card Updated")
      ).toBeInTheDocument();
      expect(
        within(widget).getByLabelText("New Summary Card Updated Icon")
      ).toHaveTextContent("Custom Icon");
      expect(
        within(widget).getByLabelText("New Summary Card Updated Icon")
      ).toHaveAttribute("color", "#FF165D");
      expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
        "1.55K"
      );
      expect(
        within(widget).getByRole("link", { name: "View" })
      ).toHaveAttribute("href", "/admin/entity-2?tab=User%20Entity%20View");
      expect(
        within(widget).queryByLabelText("Relative Count")
      ).not.toBeInTheDocument();
      expect(
        within(widget).queryByLabelText("Relative Direction")
      ).not.toBeInTheDocument();
    });

    it("should update to queryLess summary card successfully", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText(
        "New Summary Card Updated Widget"
      );

      await userEvent.click(
        within(widget).getByRole("button", { name: "Edit Widget" })
      );

      const dialog = screen.getByRole("dialog");

      await userEvent.type(within(dialog).getByLabelText("Query"), "Select");
      await userEvent.keyboard("{Enter}");

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Save" })
      );
    });

    it("should show queryLess summary card correctly", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText(
        "New Summary Card Updated Widget"
      );

      expect(
        within(widget).getByRole("link", { name: "View" })
      ).toHaveAttribute("href", "/admin/entity-2");
      expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
        "114"
      );
      expect(
        within(widget).queryByLabelText("Relative Count")
      ).not.toBeInTheDocument();
      expect(
        within(widget).queryByLabelText("Relative Direction")
      ).not.toBeInTheDocument();
    });

    it("should be deleted", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText(
        "New Summary Card Updated Widget"
      );

      await userEvent.click(
        within(widget).queryByRole("button", { name: "Delete Button" })
      );

      const confirmBox = await screen.findByRole("alertdialog", {
        name: "Confirm Delete",
      });

      await userEvent.click(
        await within(confirmBox).findByRole("button", { name: "Confirm" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Widget Deleted Successfully"
      );

      expect(
        screen.queryByLabelText("New Summary Card Updated Widget")
      ).not.toBeInTheDocument();
    });
  });
});
