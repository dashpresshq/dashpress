/* eslint-disable prettier/prettier */
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import ManageVariables from "pages/admin/settings/variables";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { getTableRows } from "__tests__/_/utils/getTableRows";

setupApiHandlers();

describe("pages/integrations/variables => credentials", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  beforeAll(() => {
    localStorage.setItem(AuthActions.JWT_TOKEN_STORAGE_KEY, "foo");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        key: "foo",
      },
      isReady: true,
    }));
  });

  describe("priviledge", () => {
    it("should not show any password text on constants tab", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      const priviledgeSection = await screen.findByLabelText(
        "constants priviledge section"
      );

      expect(
        within(priviledgeSection).queryByText(
          `For security reasons, Please input your account password to be able to manage Secrets`
        )
      ).not.toBeInTheDocument();
      expect(
        within(priviledgeSection).queryByText(
          `Your account does not have the permission to view secret values or manage them`
        )
      ).not.toBeInTheDocument();
      expect(
        within(priviledgeSection).queryByLabelText(`Password`)
      ).not.toBeInTheDocument();
      expect(
        within(priviledgeSection).queryByRole(`button`, {
          name: "Reveal Secrets",
        })
      ).not.toBeInTheDocument();
    });

    it("should show correct password text on secret tab", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );
      const priviledgeSection = await screen.findByLabelText(
        "credentials priviledge section"
      );

      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));
      expect(
        within(priviledgeSection).getByText(
          `For security reasons, Please input your account password to be able to manage Secrets`
        )
      ).toBeInTheDocument();
      expect(
        within(priviledgeSection).queryByText(
          `Your account does not have the permission to view secret values or manage them`
        )
      ).not.toBeInTheDocument();
      expect(
        within(priviledgeSection).getByLabelText(`Password`)
      ).toBeInTheDocument();
      expect(
        within(priviledgeSection).getByRole(`button`, {
          name: "Reveal Secrets",
        })
      ).toBeInTheDocument();
    });
  });

  describe("list", () => {
    it("should list credentials", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      expect(
        await getTableRows(
          within(screen.getByRole("tabpanel", { name: "Secrets" })).getByRole(
            "table"
          )
        )
      ).toMatchInlineSnapshot(`
        [
          "Key|Value",
          "{{ SECRET.PAYMENT_API_KEY }}|**********",
          "{{ SECRET.MAIL_PASSWORD }}|**********",
          "{{ SECRET.ROOT_PASSWORD }}|**********",
        ]
      `);
    });
  });

  describe("reveal", () => {
    it("should not show credentials action before revealing password", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      expect(
        screen.queryByRole("button", {
          name: "Delete Secret",
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: "Edit Secret",
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: "Add New Secret",
        })
      ).not.toBeInTheDocument();
    });

    it("should show error on invalid password and not reveal data", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      const priviledgeSection = screen.getByLabelText(
        "credentials priviledge section"
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      await userEvent.type(
        within(priviledgeSection).getByLabelText("Password"),
        "invalid password"
      );
      await userEvent.click(
        within(priviledgeSection).getByRole("button", {
          name: "Reveal Secrets",
        })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Invalid Password"
      );

      const table = within(
        screen.getByRole("tabpanel", { name: "Secrets" })
      ).getByRole("table");

      expect(
        await within(table).findByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} **********",
        })
      ).toBeInTheDocument();

      expect(
        within(table).queryByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} confidential",
        })
      ).not.toBeInTheDocument();
    });

    it("should reveal credentials and the now show the credentials action buttons", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      const priviledgeSection = screen.getByLabelText(
        "credentials priviledge section"
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      await userEvent.type(
        within(priviledgeSection).getByLabelText("Password"),
        "password"
      );
      await userEvent.click(
        within(priviledgeSection).getByRole("button", {
          name: "Reveal Secrets",
        })
      );

      await waitFor(async () => {
        expect(
          await getTableRows(
            await within(
              screen.getByRole("tabpanel", { name: "Secrets" })
            ).findByRole("table")
          )
        ).toEqual([
          "Key|Value|Action",
          "{{ SECRET.PAYMENT_API_KEY }}|super-secret",
          "{{ SECRET.MAIL_PASSWORD }}|do-not-share",
          "{{ SECRET.ROOT_PASSWORD }}|confidential",
        ]);
      });

      expect(
        within(priviledgeSection).queryByText(
          `For security reasons, Please input your account password to be able to manage Secrets`
        )
      ).not.toBeInTheDocument();
      expect(
        within(priviledgeSection).queryByLabelText(`Password`)
      ).not.toBeInTheDocument();
      expect(
        within(priviledgeSection).queryByRole(`button`, {
          name: "Reveal Secrets",
        })
      ).not.toBeInTheDocument();
    });

    it("should show credentials action after revealing password", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      expect(
        screen.queryAllByRole("button", {
          name: "Delete Secret",
        })
      ).toHaveLength(3);

      expect(
        screen.queryAllByRole("button", {
          name: "Edit Secret",
        })
      ).toHaveLength(3);
      expect(
        await screen.findByRole(
          "button",
          { name: "Add New Secret" },
          { timeout: 2000 }
        )
      ).toBeInTheDocument();
    });
  });

  describe("update", () => {
    it("should update secret", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      const table = within(
        screen.getByRole("tabpanel", { name: "Secrets" })
      ).getByRole("table");

      expect(
        await within(table).findByRole(
          "row",
          {
            name: "{{ SECRET.PAYMENT_API_KEY }} super-secret",
          },
          {
            interval: 100,
            timeout: 2000,
          }
        )
      ).toBeInTheDocument();

      await userEvent.click(
        within((await within(table).findAllByRole("row"))[1]).getByRole(
          "button",
          {
            name: "Edit Secret",
          }
        )
      );

      const dialog = screen.getByRole("dialog");

      expect(within(dialog).getByText("Update Secret")).toBeInTheDocument();

      expect(within(dialog).getByLabelText("Key")).toBeDisabled();

      await userEvent.type(within(dialog).getByLabelText("Value"), "__updated");

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Update Secret" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Secret Saved Successfully"
      );

      await waitFor(async () => {
        expect(await getTableRows(table)).toEqual([
          "Key|Value|Action",
          "{{ SECRET.PAYMENT_API_KEY }}|super-secret__updated",
          "{{ SECRET.MAIL_PASSWORD }}|do-not-share",
          "{{ SECRET.ROOT_PASSWORD }}|confidential",
        ]);
      });
    });
  });

  describe("create", () => {
    it("should create new secret", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      await userEvent.click(
        await screen.findByRole(
          "button",
          { name: "Add New Secret" },
          { timeout: 2000 }
        )
      );

      const dialog = await screen.findByRole("dialog");

      expect(within(dialog).getByText("Create Secret")).toBeInTheDocument();

      await userEvent.type(within(dialog).getByLabelText("Key"), "NEW_SECRET");
      await userEvent.type(
        within(dialog).getByLabelText("Value"),
        "new secret"
      );

      await userEvent.click(
        within(dialog).getByRole("button", { name: "Create Secret" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Secret Saved Successfully"
      );

      expect(
        await screen.findByRole(
          "row",
          {
            name: "{{ SECRET.NEW_SECRET }} new secret",
          },
          {
            timeout: 2000,
            interval: 100,
          }
        )
      ).toBeInTheDocument();
    });
  });

  describe("delete", () => {
    it("should delete secrets", async () => {
      render(
        <ApplicationRoot>
          <ManageVariables />
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      const table = screen.getByRole("tabpanel", { name: "Secrets" });

      const tableRows = await within(table).findAllByRole("row");

      expect(tableRows).toHaveLength(5);

      await userEvent.click(
        within(tableRows[2]).getByRole("button", {
          name: "Delete Secret",
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
        "Secret Deleted Successfully"
      );
    });
  });
});
