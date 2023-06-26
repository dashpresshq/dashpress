import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import ManageVariables from "pages/integrations/variables";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";

setupApiHandlers();

describe("pages/integrations/variables => constants", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  beforeAll(() => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        key: "foo",
      },
    }));
  });

  describe("list", () => {
    it("should list constants", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      const table = await screen.findByRole("table");

      expect(
        await within(table).findByRole("row", {
          name: "Key Sort By Key Filter Key By Search Value Sort By Value Action",
        })
      ).toBeInTheDocument();
      expect(
        within(table).getByRole("row", {
          name: "{{ CONSTANT.BASE_URL }} http://base.com",
        })
      ).toBeInTheDocument();
      expect(
        within(table).getByRole("row", {
          name: "{{ CONSTANT.FOO_CONSTANT_KEY }} foo constant value",
        })
      ).toBeInTheDocument();
      expect(
        within(table).getByRole("row", {
          name: "{{ CONSTANT.BAR_CONSTANT_KEY }} bar constant value",
        })
      ).toBeInTheDocument();
    });
  });

  describe("create", () => {
    it("should create new constant", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );
      await userEvent.click(
        await screen.findByRole("button", { name: "Add New Constant" })
      );

      const dialog = screen.getByRole("dialog");

      expect(within(dialog).getByText("Create Constant")).toBeInTheDocument();

      await userEvent.type(within(dialog).getByLabelText("Key"), "NEW_KEY");
      await userEvent.type(within(dialog).getByLabelText("Value"), "new value");

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Create Constant" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Constant Saved Successfully"
      );
    });

    it("should show created constant", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      const table = screen.getByRole("table");

      expect(within(table).getAllByRole("row")).toHaveLength(5);

      expect(
        within(table).getByRole("row", {
          name: "{{ CONSTANT.NEW_KEY }} new value",
        })
      ).toBeInTheDocument();
    });
  });

  describe("update", () => {
    it("should update constant", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      const table = screen.getByRole("table");

      const tableRows = await within(table).findAllByRole("row");

      await userEvent.click(
        within(tableRows[1]).getByRole("button", {
          name: "Edit",
        })
      );

      const dialog = screen.getByRole("dialog");

      expect(within(dialog).getByText("Update Constant")).toBeInTheDocument();

      expect(within(dialog).getByLabelText("Key")).toBeDisabled();

      await userEvent.type(within(dialog).getByLabelText("Value"), "/updated");

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Update Constant" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Constant Saved Successfully"
      );
    });

    it("should show updated constant", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      const table = screen.getByRole("table");

      expect(
        within(table).getByRole("row", {
          name: "{{ CONSTANT.BASE_URL }} http://base.com/updated",
        })
      ).toBeInTheDocument();
    });
  });

  describe("delete", () => {
    it("should delete constants", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      const table = screen.getByRole("table");

      const tableRows = await within(table).findAllByRole("row");

      expect(tableRows).toHaveLength(5);

      await userEvent.click(
        within(tableRows[2]).getByRole("button", {
          name: "Delete Button",
        })
      );

      const confirmBox = await screen.findByRole("alertdialog", {
        name: "Confirm Delete",
      });

      await userEvent.click(
        await within(confirmBox).findByRole("button", { name: "Confirm" })
      );

      expect(await within(table).findAllByRole("row")).toHaveLength(4);

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Constant Deleted Successfully"
      );
    });
  });
});
