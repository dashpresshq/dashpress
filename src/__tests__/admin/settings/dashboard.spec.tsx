import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/admin/settings/dashboard";
import Dashboard from "pages/admin";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { IWidgetConfig } from "shared/types/dashboard";

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
        within(dialog).getByLabelText("Query"),
        "Verified Entity View"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Date Field"),
        "entity-1-date-field"
      );
      await userEvent.keyboard("{Enter}");

      // await userEvent.type(
      //   within(dialog).getByLabelText("Date Field"),
      //   "entity-1-enum-field"
      // );
      // await userEvent.keyboard("{Enter}");

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
          <Dashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Summary Card Widget");

      expect(
        await within(widget).findByText("New Summary Card")
      ).toBeInTheDocument();
      expect(
        within(widget).getByLabelText("New Summary Card Icon")
      ).toHaveTextContent("Demo SVG");
      expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
        "1.39K"
      );
      expect(within(widget).getByLabelText("Relative Count")).toHaveTextContent(
        "57%"
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
        "1.39K"
      );
      expect(within(widget).getByLabelText("Relative Count")).toHaveTextContent(
        "114%"
      );
      expect(
        within(widget).getByLabelText("Relative Direction")
      ).toHaveAttribute("color", "#03d87f");
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
        await within(dialog).findByText("Edit Dashboard Item")
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

      await userEvent.type(
        within(dialog).getByLabelText("SVG"),
        "<p>Updated</p>"
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
      ).toHaveTextContent("Demo SVGUpdated");
      expect(
        within(widget).getByLabelText("New Summary Card Updated Icon")
      ).toHaveAttribute("color", "#FF165D");
      expect(within(widget).getByLabelText("Total Count")).toHaveTextContent(
        "1.41K"
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

  describe("Query Selection", () => {
    it("should be shown only when we have entities selected", async () => {
      const pushMock = jest.fn();
      useRouter.mockImplementation(() => ({
        push: pushMock,
        query: {},
      }));

      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await userEvent.click(
        screen.getByRole("button", { name: "New Dashboard Item" })
      );

      const dialog = screen.getByRole("dialog");

      // Query selection should be hidden
      expect(within(dialog).queryByLabelText("Query")).not.toBeInTheDocument();
      expect(
        within(dialog).queryByRole("button", { name: "Manage Queries" })
      ).not.toBeInTheDocument();

      // Select an entity
      await userEvent.type(
        within(dialog).getByLabelText("Entity"),
        "Plural entity-1"
      );
      await userEvent.keyboard("{Enter}");

      // Query selection should be shown
      expect(within(dialog).getByLabelText("Query")).toBeInTheDocument();
      await userEvent.click(
        within(dialog).getByRole("button", { name: "Manage Queries" })
      );
      // `Manage Queries` should link to the correct page
      expect(pushMock).toHaveBeenCalledWith("/admin/entity-1/config/views");

      // De-select entity
      await userEvent.type(
        within(dialog).getByLabelText("Entity"),
        "Select Entity"
      );
      await userEvent.keyboard("{Enter}");

      // Query selection should be hidden
      expect(within(dialog).queryByLabelText("Query")).not.toBeInTheDocument();
      expect(
        within(dialog).queryByRole("button", { name: "Manage Queries" })
      ).not.toBeInTheDocument();
    });
  });

  describe("Form Input", () => {
    type FormLabels =
      | "Title"
      | "Entity"
      | "Type"
      | "Color"
      | "Date Field"
      | "SVG"
      | "Query";
    const options: Record<
      IWidgetConfig["_type"],
      {
        fields: Record<FormLabels, boolean>;
        label: string;
      }
    > = {
      "summary-card": {
        label: "Summary Card",
        fields: {
          Color: true,
          "Date Field": true,
          Entity: true,
          Query: true,
          SVG: true,
          Title: true,
          Type: true,
        },
      },
      table: {
        label: "Table",
        fields: {
          Color: false,
          "Date Field": false,
          Entity: true,
          Query: true,
          SVG: false,
          Title: true,
          Type: true,
        },
      },
    };

    it.each(
      Object.entries(options).map(([widgetType, { fields, label }]) => ({
        widgetType,
        fields,
        label,
      }))
    )(
      "should show the correct fields for $widgetType",
      async ({ fields, label }) => {
        render(
          <AppWrapper>
            <ManageDashboard />
          </AppWrapper>
        );

        await userEvent.click(
          screen.getByRole("button", { name: "New Dashboard Item" })
        );

        const dialog = screen.getByRole("dialog");

        await userEvent.type(within(dialog).getByLabelText("Type"), label);
        await userEvent.keyboard("{Enter}");

        await userEvent.type(
          within(dialog).getByLabelText("Entity"),
          "Plural entity-1"
        );
        await userEvent.keyboard("{Enter}");

        Object.entries(fields).forEach(([field, shouldBePresent]) => {
          if (shouldBePresent) {
            expect(within(dialog).getByLabelText(field)).toBeInTheDocument();
          } else {
            expect(
              within(dialog).queryByLabelText(field)
            ).not.toBeInTheDocument();
          }
        });
      }
    );
  });

  // Should create table widget
  // Should delete table
  // Should update table
  // Should re-arrange card and table
});
