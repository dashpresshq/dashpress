/* eslint-disable prettier/prettier */
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { rest } from "msw";

import ManageVariables from "pages/admin/settings/variables";

import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import userEvent from "@testing-library/user-event";
import { IAuthenticatedUserBag } from "shared/types/user";
import { USER_PERMISSIONS } from "shared/constants/user";
import { AuthActions } from "frontend/hooks/auth/auth.actions";
import { getTableRows } from "__tests__/_/utils/getTableRows";

const server = setupApiHandlers();

describe("pages/integrations/variables => credentials -- non admin", () => {
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

    const CUSTOM_ROLE_USER: IAuthenticatedUserBag = {
      name: "Custom Role",
      permissions: [USER_PERMISSIONS.CAN_CONFIGURE_APP],
      role: "custom-role",
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

      expect(
        within(priviledgeSection).queryByText(
          `For security reasons, Please input your account password to be able to manage values`
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
          name: "Delete Secret",
        })
      ).not.toBeInTheDocument();
    });

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
          `For security reasons, Please input your account password to be able to manage values`
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
          name: "Delete Constant",
        })
      ).toHaveLength(3);
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

      expect(await getTableRows(screen.getByRole("table")))
        .toMatchInlineSnapshot(`
        [
          "Key|Value",
          "{{ SECRET.PAYMENT_API_KEY }}|**********",
          "{{ SECRET.MAIL_PASSWORD }}|**********",
          "{{ SECRET.ROOT_PASSWORD }}|**********",
        ]
      `);
    });
  });
});
