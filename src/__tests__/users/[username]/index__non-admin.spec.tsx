import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { rest } from "msw";

import UserUpdate from "pages/users/[username]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import { IAuthenticatedUserBag } from "shared/types/user";
import { USER_PERMISSIONS } from "shared/constants/user";

const server = setupApiHandlers();

const VIEWER: IAuthenticatedUserBag = {
  name: "Root User",
  permissions: [USER_PERMISSIONS.CAN_MANAGE_USERS],
  role: "custom-role",
  username: "root",
};

describe("pages/users/[username]/index", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  beforeAll(() => {
    server.use(
      rest.get(BASE_TEST_URL("/api/account/mine"), async (_, res, ctx) => {
        return res(ctx.json(VIEWER));
      })
    );
  });
  describe("Reset Password", () => {
    it("should be hidden when user doesn't have the permission to reset password", async () => {
      useRouter.mockImplementation(() => ({
        asPath: "/",
        query: {
          username: "foo",
        },
        isReady: true,
      }));
      render(
        <ApplicationRoot>
          <UserUpdate />
        </ApplicationRoot>
      );
      await waitFor(() => {
        expect(screen.getByLabelText("Role")).toBeInTheDocument();
      });

      expect(
        screen.queryByRole("heading", { name: "Reset User Password" })
      ).not.toBeInTheDocument();
    });

    it("should be hidden when user doesn't have the permission to reset password and is current user", async () => {
      useRouter.mockImplementation(() => ({
        asPath: "/",
        query: {
          username: "root",
        },
        isReady: true,
      }));
      render(
        <ApplicationRoot>
          <UserUpdate />
        </ApplicationRoot>
      );

      await waitFor(() => {
        expect(screen.getByLabelText("Role")).toBeInTheDocument();
      });

      expect(
        screen.queryByRole("heading", { name: "Reset User Password" })
      ).not.toBeInTheDocument();
    });
  });
});
