/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/dashboard/manage";

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
  describe("Form Input", () => {
    type FormLabels =
      | "Title"
      | "Entity"
      | "Type"
      | "Color"
      | "Date Field"
      | "Icon"
      | "Query";
    const options: Partial<
      Record<
        IWidgetConfig["_type"],
        {
          fields: Record<FormLabels, boolean>;
          label: string;
        }
      >
    > = {
      "summary-card": {
        label: "Summary Card",
        fields: {
          Color: true,
          "Date Field": true,
          Entity: true,
          Query: true,
          Icon: true,
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
          Icon: false,
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
          screen.getByRole("button", { name: "Add New Widget" })
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

      expect(replaceMock).toHaveBeenCalledWith("/");
    });
  });

  describe("Icon Input", () => {
    it("should toggle Icon Input correctly", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Add New Widget" })
      );

      const dialog = screen.getByRole("dialog");

      // Icon Toggle should be hidden
      expect(
        within(dialog).queryByLabelText("Use Icon")
      ).not.toBeInTheDocument();

      expect(
        within(dialog).queryByLabelText("Use SVG")
      ).not.toBeInTheDocument();

      // Show Icon List

      await userEvent.type(
        within(dialog).getByLabelText("Type"),
        "Summary Card"
      );
      await userEvent.keyboard("{Enter}");

      expect(within(dialog).queryByLabelText("SVG")).not.toBeInTheDocument();

      expect(within(dialog).queryByRole("Use Icon")).not.toBeInTheDocument();

      expect(
        within(dialog).getByRole("button", { name: "Use SVG" })
      ).toBeInTheDocument();

      // expect(container.querySelector(`input[name="icon"]`)).toHaveValue(
      //   "ShoppingCart"
      // );

      await userEvent.type(within(dialog).getByLabelText("Icon"), "Download");

      // expect(container.querySelector(`input[name="icon"]`)).toHaveValue(
      //   "Download"
      // );

      // Show TextArea List

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Use SVG" })
      );

      expect(within(dialog).queryByLabelText("Icon")).not.toBeInTheDocument();

      expect(
        within(dialog).queryByRole("button", { name: "Use SVG" })
      ).not.toBeInTheDocument();

      expect(
        within(dialog).getByRole("button", { name: "Use Icon" })
      ).toBeInTheDocument();

      expect(within(dialog).getByLabelText("SVG")).toHaveValue("");

      await userEvent.type(
        within(dialog).getByLabelText("SVG"),
        "<p>Custom Icon</p>"
      );

      expect(within(dialog).getByLabelText("SVG")).toHaveValue(
        "<p>Custom Icon</p>"
      );

      // Toggle Back to Icon List

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Use Icon" })
      );
      expect(within(dialog).queryByLabelText("SVG")).not.toBeInTheDocument();

      expect(
        within(dialog).queryByLabelText("Use Icon")
      ).not.toBeInTheDocument();

      // expect(container.querySelector(`input[name="icon"]`)).toHaveValue(
      //   "ShoppingCart"
      // );

      expect(
        within(dialog).getByRole("button", { name: "Use SVG" })
      ).toBeInTheDocument();

      await userEvent.type(within(dialog).getByLabelText("Icon"), "Mail");
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
        screen.getByRole("button", { name: "Add New Widget" })
      );

      const dialog = screen.getByRole("dialog");

      // Query selection should be hidden
      expect(within(dialog).queryByLabelText("Query")).not.toBeInTheDocument();
      expect(
        within(dialog).queryByRole("button", { name: "Manage Queries" })
      ).not.toBeInTheDocument();

      await userEvent.type(within(dialog).getByLabelText("Type"), "Table");
      await userEvent.keyboard("{Enter}");

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
});
