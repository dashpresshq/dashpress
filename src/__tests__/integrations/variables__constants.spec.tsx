import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import {
  closeAllToasts,
  confirmDelete,
  getToastMessage,
} from "__tests__/_/utils/closeAllToasts";
import { getTableRows } from "__tests__/_/utils/getTableRows";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ManageVariables from "pages/integrations/variables";

setupApiHandlers();

describe("pages/integrations/variables => constants", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(
    USE_ROUTER_PARAMS({
      query: {
        key: "foo",
      },
    })
  );

  describe("list", () => {
    it("should list constants", async () => {
      render(
        <TestProviders>
          <ManageVariables />
        </TestProviders>
      );

      expect(
        await getTableRows(
          await within(
            screen.getByRole("tabpanel", { name: "Constants" })
          ).findByRole("table")
        )
      ).toMatchInlineSnapshot(`
        [
          "Key|Value|Action",
          "{{ CONSTANT.BASE_URL }}|http://base.com",
          "{{ CONSTANT.FOO_CONSTANT_KEY }}|foo constant value",
          "{{ CONSTANT.BAR_CONSTANT_KEY }}|bar constant value",
        ]
      `);
    });
  });

  describe("create", () => {
    it("should create new constant", async () => {
      render(
        <TestProviders>
          <ManageVariables />
        </TestProviders>
      );
      await userEvent.click(
        await screen.findByRole("button", { name: "Add New Constant" })
      );

      const dialog = await screen.findByRole("dialog");

      expect(within(dialog).getByText("Create Constant")).toBeInTheDocument();

      await userEvent.type(within(dialog).getByLabelText("Key"), "NEW_KEY");
      await userEvent.type(within(dialog).getByLabelText("Value"), "new value");

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Create Constant" })
      );

      expect(await getToastMessage()).toBe("Constant Saved Successfully");
    });

    it("should show created constant", async () => {
      render(
        <TestProviders>
          <ManageVariables />
        </TestProviders>
      );

      expect(
        await getTableRows(
          within(screen.getByRole("tabpanel", { name: "Constants" })).getByRole(
            "table"
          )
        )
      ).toMatchInlineSnapshot(`
        [
          "Key|Value|Action",
          "{{ CONSTANT.BASE_URL }}|http://base.com",
          "{{ CONSTANT.FOO_CONSTANT_KEY }}|foo constant value",
          "{{ CONSTANT.BAR_CONSTANT_KEY }}|bar constant value",
        ]
      `);
    });
  });

  describe("update", () => {
    it("should update constant", async () => {
      render(
        <TestProviders>
          <ManageVariables />
        </TestProviders>
      );

      const table = within(
        screen.getByRole("tabpanel", { name: "Constants" })
      ).getByRole("table");

      const tableRows = await within(table).findAllByRole("row");

      await userEvent.click(
        within(tableRows[1]).getByRole("button", {
          name: "Edit Constant",
        })
      );

      const dialog = screen.getByRole("dialog");

      expect(within(dialog).getByText("Update Constant")).toBeInTheDocument();

      expect(within(dialog).getByLabelText("Key")).toBeDisabled();

      await userEvent.type(within(dialog).getByLabelText("Value"), "/updated");

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Update Constant" })
      );

      expect(await getToastMessage()).toBe("Constant Saved Successfully");

      await closeAllToasts();
    });

    it("should show updated constant", async () => {
      render(
        <TestProviders>
          <ManageVariables />
        </TestProviders>
      );

      expect(
        await getTableRows(
          within(screen.getByRole("tabpanel", { name: "Constants" })).getByRole(
            "table"
          )
        )
      ).toMatchInlineSnapshot(`
        [
          "Key|Value|Action",
          "{{ CONSTANT.BASE_URL }}|http://base.com",
          "{{ CONSTANT.FOO_CONSTANT_KEY }}|foo constant value",
          "{{ CONSTANT.BAR_CONSTANT_KEY }}|bar constant value",
        ]
      `);
    });
  });

  describe("delete", () => {
    it("should delete constants", async () => {
      render(
        <TestProviders>
          <ManageVariables />
        </TestProviders>
      );

      const table = within(
        screen.getByRole("tabpanel", { name: "Constants" })
      ).getByRole("table");

      const tableRows = await within(table).findAllByRole("row");

      expect(tableRows).toHaveLength(5);

      await userEvent.click(
        within(tableRows[2]).getByRole("button", {
          name: "Delete Constant",
        })
      );

      await confirmDelete();

      expect(await within(table).findAllByRole("row")).toHaveLength(4);

      expect(await getToastMessage()).toBe("Constant Deleted Successfully");
    });
  });
});
