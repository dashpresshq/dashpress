/* eslint-disable prettier/prettier */
import React, { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { rest } from "msw";

import ManageVariables from "pages/admin/settings/variables";

import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { useUserAuthenticatedState } from "frontend/hooks/auth/useAuthenticateUser";
import { IAuthenticatedUserBag } from "shared/types/user";
import { USER_PERMISSIONS } from "shared/constants/user";

const server = setupApiHandlers();

function AuthenticatedApplicationRoot({ children }: { children: ReactNode }) {
  useUserAuthenticatedState();

  return <ApplicationRoot>{children}</ApplicationRoot>;
}

describe("pages/integrations/variables => credentials -- non admin", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  beforeAll(() => {
    localStorage.setItem("__auth-token__", "foo");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        key: "foo",
      },
    }));

    const CUSTOM_ROLE_USER: IAuthenticatedUserBag = {
      name: "Custom Role",
      permissions: [USER_PERMISSIONS.CAN_CONFIGURE_APP],
      role: "custom-role",
      systemProfile: "{userId: 1}",
      username: "root",
    };
    server.use(
      rest.get(BASE_TEST_URL("/api/account/mine"), async (_, res, ctx) => {
        return res(ctx.json(CUSTOM_ROLE_USER));
      })
    );
  });

  describe("priviledge", () => {
    it("should show correct password text for `CAN_CONFIGURE_APP_USERS`", async () => {
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

      expect(
        within(priviledgeSection).queryByText(
          `For security reasons, Please input your account password to be able to reveal values`
        )
      ).not.toBeInTheDocument();
      expect(
        within(priviledgeSection).getByText(
          `Your account does not have the permission to view secret values or manage them`
        )
      ).toBeInTheDocument();
      expect(
        within(priviledgeSection).queryByLabelText(`Password`)
      ).not.toBeInTheDocument();
      expect(
        within(priviledgeSection).queryByRole(`button`, {
          name: "Reveal Secrets",
        })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", {
          name: "Delete Button",
        })
      ).not.toBeInTheDocument();
    });

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
          `For security reasons, Please input your account password to be able to reveal values`
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
      expect(
        await screen.findAllByRole("button", {
          name: "Delete Button",
        })
      ).toHaveLength(3);
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
});
