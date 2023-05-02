import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/dashboard/manage";
import Dashboard from "pages";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { getTableRows } from "__tests__/_/utiis/getTableRows";

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
  describe("Table Widget", () => {
    it("should create table widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Add New Widget" })
      );

      const dialog = screen.getByRole("dialog");

      await userEvent.type(
        await within(dialog).findByLabelText("Title"),
        "New Table"
      );

      await userEvent.type(within(dialog).getByLabelText("Type"), "Table");
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Entity"),
        "Plural entity-1"
      );
      await userEvent.keyboard("{Enter}");

      await userEvent.type(
        within(dialog).getByLabelText("Query"),
        "Verified Entity View"
      );
      await userEvent.keyboard("{Enter}");
      await userEvent.click(
        within(dialog).getByRole("button", { name: "Save" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Widget Created Successfully"
      );
    });

    it("should show the new table widget", async () => {
      render(
        <AppWrapper>
          <Dashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Table Widget");

      expect(await within(widget).findByText("New Table")).toBeInTheDocument();

      expect(
        within(widget).getByRole("link", { name: "View" })
      ).toHaveAttribute("href", "/admin/entity-1?tab=Verified%20Entity%20View");

      expect(await getTableRows(widget)).toMatchInlineSnapshot(`
        [
          "Entity 1 Id FieldEntity 1 Reference FieldEntity 1 String FieldEntity 1 Number FieldEntity 1 Boolean FieldEntity 1 Date FieldEntity 1 Enum Field",
          "26‌hello > p-1,t=5,o=a < 347th May 2022foo",
          "27‌there > p-1,t=5,o=a < 217th May 2021foo",
          "28‌today > p-1,t=5,o=a < 187th Feb 2022bar",
        ]
      `);
    });

    it("should update table widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Table Widget");

      await userEvent.click(
        within(widget).getByRole("button", { name: "Edit Widget" })
      );

      const dialog = screen.getByRole("dialog");

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

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Save" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Widget Updated Successfully"
      );
    });

    it("should show the updated table widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Table Updated Widget");

      expect(
        await within(widget).findByText("New Table Updated")
      ).toBeInTheDocument();

      expect(
        within(widget).getByRole("link", { name: "View" })
      ).toHaveAttribute("href", "/admin/entity-2?tab=User%20Entity%20View");

      expect(await getTableRows(widget)).toMatchInlineSnapshot(`
        [
          "Entity 2 Id FieldEntity 2 Reference FieldEntity 2 String FieldEntity 2 Number FieldEntity 2 Boolean FieldEntity 2 Date FieldEntity 2 Enum Field",
          "184‌hello > p-1,t=5,o=a < 347th May 2022foo",
          "185‌there > p-1,t=5,o=a < 217th May 2021foo",
          "186‌today > p-1,t=5,o=a < 187th Feb 2022bar",
        ]
      `);
    });

    it("should update to queryLess summary card successfully", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Table Updated Widget");

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

      const widget = await screen.findByLabelText("New Table Updated Widget");

      expect(
        within(widget).getByRole("link", { name: "View" })
      ).toHaveAttribute("href", "/admin/entity-2");

      expect(await getTableRows(widget)).toMatchInlineSnapshot(`
        [
          "Entity 2 Id FieldEntity 2 Reference FieldEntity 2 String FieldEntity 2 Number FieldEntity 2 Boolean FieldEntity 2 Date FieldEntity 2 Enum Field",
          "184‌hello > p-1,t=5,o=a < 347th May 2022foo",
          "185‌there > p-1,t=5,o=a < 217th May 2021foo",
          "186‌today > p-1,t=5,o=a < 187th Feb 2022bar",
        ]
      `);
    });

    it("should be deleted", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("New Table Updated Widget");

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
        screen.queryByLabelText("New Table Updated Widget")
      ).not.toBeInTheDocument();
    });
  });
});
