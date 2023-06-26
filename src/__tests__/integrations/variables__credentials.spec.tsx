/* eslint-disable prettier/prettier */
import "@testing-library/jest-dom";
import React, { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import ManageVariables from "pages/admin/settings/variables";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { useUserAuthenticatedState } from "frontend/hooks/auth/useAuthenticateUser";

setupApiHandlers();

function AuthenticatedApplicationRoot({ children }: { children: ReactNode }) {
  useUserAuthenticatedState();

  return <ApplicationRoot>{children}</ApplicationRoot>;
}

describe("pages/integrations/variables => credentials", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  beforeAll(() => {
    localStorage.setItem("__auth-token__", "foo");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        key: "foo",
      },
    }));
  });

  describe("priviledge", () => {
    it("should not show any password text on constants tab", async () => {
      render(
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
      );

      const priviledgeSection = await screen.findByLabelText(
        "constants priviledge section"
      );

      expect(
        within(priviledgeSection).queryByText(
          `Please input your account password to be able to see secret values and manage them`
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
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
      );
      const priviledgeSection = await screen.findByLabelText(
        "credentials priviledge section"
      );

      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));
      expect(
        within(priviledgeSection).getByText(
          `Please input your account password to be able to see secret values and manage them`
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
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      const table = screen.getByRole("table");

      expect(
        await within(table).findByRole("row", {
          name: "Key Sort By Key Filter Key By Search Value Sort By Value",
        })
      ).toBeInTheDocument();
      expect(
        within(table).getByRole("row", {
          name: "{{ SECRET.PAYMENT_API_KEY }} **********",
        })
      ).toBeInTheDocument();
      expect(
        within(table).getByRole("row", {
          name: "{{ SECRET.MAIL_PASSWORD }} **********",
        })
      ).toBeInTheDocument();
      expect(
        within(table).getByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} **********",
        })
      ).toBeInTheDocument();
    });
  });

  describe("reveal", () => {
    it("should not show credentials action before revealing password", async () => {
      render(
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      expect(
        screen.queryByRole("button", {
          name: "Delete Button",
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: "Edit",
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
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
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

      const table = screen.getByRole("table");

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
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
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

      const table = screen.getByRole("table");

      expect(
        await within(table).findByRole("row", {
          name: "Key Sort By Key Filter Key By Search Value Sort By Value Action",
        })
      ).toBeInTheDocument();
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

      expect(
        within(table).getByRole("row", {
          name: "{{ SECRET.MAIL_PASSWORD }} do-not-share",
        })
      ).toBeInTheDocument();
      expect(
        await within(table).findByRole("row", {
          name: "Key Sort By Key Filter Key By Search Value Sort By Value Action",
        })
      ).toBeInTheDocument();
      expect(
        within(table).getByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} confidential",
        })
      ).toBeInTheDocument();
      expect(
        within(table).queryByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} **********",
        })
      ).not.toBeInTheDocument();

      expect(
        within(priviledgeSection).queryByText(
          `Please input your account password to be able to see secret values and manage them`
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
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      expect(
        screen.queryAllByRole("button", {
          name: "Delete Button",
        })
      ).toHaveLength(3);

      expect(
        screen.queryAllByRole("button", {
          name: "Edit",
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

  describe("create", () => {
    it("should create new secret", async () => {
      render(
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
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

      const dialog = screen.getByRole("dialog");

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

  describe("update", () => {
    it("should update secret", async () => {
      render(
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      const table = screen.getByRole("table");

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
            name: "Edit",
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

      expect(
        await within(table).findByRole("row", {
          name: "{{ SECRET.PAYMENT_API_KEY }} super-secret__updated",
        })
      ).toBeInTheDocument();
    });
  });

  describe("delete", () => {
    it("should delete secrets", async () => {
      render(
        <AuthenticatedApplicationRoot>
          <ManageVariables />
        </AuthenticatedApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("tab", { name: "Secrets" })
      );

      const tableRows = await screen.findAllByRole("row");

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

      expect(await screen.findAllByRole("row")).toHaveLength(4);

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Secret Deleted Successfully"
      );
    });
  });
});
