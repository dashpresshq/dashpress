/* eslint-disable prettier/prettier */
import "@testing-library/jest-dom";
import React, { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";

import ManageVariables from "pages/admin/settings/variables";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { useUserAuthenticatedState } from "frontend/hooks/auth/useAuthenticateUser";

setupApiHandlers();

function AuthenticatedAppWrapper({ children }: { children: ReactNode }) {
  useUserAuthenticatedState();

  return <AppWrapper>{children}</AppWrapper>;
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
        <AuthenticatedAppWrapper>
          <ManageVariables />
        </AuthenticatedAppWrapper>
      );
      expect(
        screen.queryByText(
          `For security reasons, Please input your account password to be able to reveal values`
        )
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText(
          `Your account does not have the permission to view secret values or manage them`
        )
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText(`Password`)).not.toBeInTheDocument();
      expect(
        screen.queryByRole(`button`, { name: "Reveal Secrets" })
      ).not.toBeInTheDocument();
      expect(
        await screen.findAllByRole("button", {
          name: "Delete Button",
        })
      ).toHaveLength(3);
    });

    it("should show correct password text on secret tab", async () => {
      render(
        <AuthenticatedAppWrapper>
          <ManageVariables />
        </AuthenticatedAppWrapper>
      );
      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));
      expect(
        screen.getByText(
          `For security reasons, Please input your account password to be able to reveal values`
        )
      ).toBeInTheDocument();
      expect(
        screen.queryByText(
          `Your account does not have the permission to view secret values or manage them`
        )
      ).not.toBeInTheDocument();
      expect(screen.getByLabelText(`Password`)).toBeInTheDocument();
      expect(
        screen.getByRole(`button`, { name: "Reveal Secrets" })
      ).toBeInTheDocument();
      expect(
        screen.getAllByRole("button", {
          name: "Delete Button",
        })
      ).toHaveLength(3);
    });
  });

  // reveal should not be available for users without action role

  describe("list", () => {
    it("should list credentials", async () => {
      render(
        <AuthenticatedAppWrapper>
          <ManageVariables />
        </AuthenticatedAppWrapper>
      );

      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));

      expect(
        await screen.findByRole("row", {
          name: "Key Sort By Key Filter By Search Value Sort By Value Action",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", {
          name: "{{ SECRET.PAYMENT_API_KEY }} **********",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", {
          name: "{{ SECRET.MAIL_PASSWORD }} **********",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} **********",
        })
      ).toBeInTheDocument();
    });
  });

  describe("reveal", () => {
    it("should reveal show error on invalid password and not reveal data", async () => {
      render(
        <AuthenticatedAppWrapper>
          <ManageVariables />
        </AuthenticatedAppWrapper>
      );

      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));

      await userEvent.type(
        screen.getByLabelText("Password"),
        "invalid password"
      );
      await userEvent.click(
        screen.getByRole("button", { name: "Reveal Secrets" })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Invalid Password"
      );

      expect(
        screen.queryByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} confidential",
        })
      ).not.toBeInTheDocument();
      expect(
        await screen.findByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} **********",
        })
      ).toBeInTheDocument();
    });

    it("should reveal credentials", async () => {
      render(
        <AuthenticatedAppWrapper>
          <ManageVariables />
        </AuthenticatedAppWrapper>
      );

      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));

      await userEvent.type(screen.getByLabelText("Password"), "password");
      await userEvent.click(
        screen.getByRole("button", { name: "Reveal Secrets" })
      );

      expect(
        await screen.findByRole("row", {
          name: "Key Sort By Key Filter By Search Value Sort By Value Action",
        })
      ).toBeInTheDocument();
      expect(
        await screen.findByRole(
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
        screen.getByRole("row", {
          name: "{{ SECRET.MAIL_PASSWORD }} do-not-share",
        })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} confidential",
        })
      ).toBeInTheDocument();
      expect(
        screen.queryByRole("row", {
          name: "{{ SECRET.ROOT_PASSWORD }} **********",
        })
      ).not.toBeInTheDocument();

      expect(
        screen.queryByText(
          `For security reasons, Please input your account password to be able to reveal values`
        )
      ).not.toBeInTheDocument();
      expect(screen.queryByLabelText(`Password`)).not.toBeInTheDocument();
      expect(
        screen.queryByRole(`button`, { name: "Reveal Secrets" })
      ).not.toBeInTheDocument();
    });
  });

  describe("create", () => {
    it("should create new secret", async () => {
      render(
        <AuthenticatedAppWrapper>
          <ManageVariables />
        </AuthenticatedAppWrapper>
      );

      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));

      // await userEvent.type(screen.getByLabelText("Password"), "password");
      // await userEvent.click(
      //   screen.getByRole("button", { name: "Reveal Secrets" })
      // );

      await userEvent.click(
        await screen.findByRole(
          "button",
          { name: "Add New Secret" },
          { timeout: 2000 }
        )
      );

      expect(
        within(screen.getByRole("dialog")).getByText("Create Secret")
      ).toBeInTheDocument();

      await userEvent.type(screen.getByLabelText("Key"), "NEW_SECRET");
      await userEvent.type(screen.getByLabelText("Value"), "new secret");

      await userEvent.click(screen.getByRole("button", { name: "Save" }));

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
        <AuthenticatedAppWrapper>
          <ManageVariables />
        </AuthenticatedAppWrapper>
      );

      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));

      expect(
        await screen.findByRole(
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
        within((await screen.findAllByRole("row"))[1]).getByRole("button", {
          name: "Edit",
        })
      );

      expect(
        within(screen.getByRole("dialog")).getByText("Update Secret")
      ).toBeInTheDocument();

      expect(screen.getByLabelText("Key")).toBeDisabled();

      await userEvent.type(screen.getByLabelText("Value"), "__updated");

      await userEvent.click(screen.getByRole("button", { name: "Save" }));

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Secret Saved Successfully"
      );

      expect(
        await screen.findByRole("row", {
          name: "{{ SECRET.PAYMENT_API_KEY }} super-secret__updated",
        })
      ).toBeInTheDocument();
    });
  });

  describe("delete", () => {
    it("should delete secrets", async () => {
      render(
        <AuthenticatedAppWrapper>
          <ManageVariables />
        </AuthenticatedAppWrapper>
      );

      await userEvent.click(screen.getByRole("tab", { name: "Secrets" }));

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
