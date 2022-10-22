import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import { rest } from "msw";

import UserUpdate from "pages/users/[username]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import { IAuthenticatedUserBag, USER_PERMISSIONS } from "shared/types/user";

const server = setupApiHandlers();

const VIEWER: IAuthenticatedUserBag = {
  name: "Root User",
  permissions: [USER_PERMISSIONS.CAN_MANAGE_USER],
  role: "custom-role",
  systemProfile: "{userId: 1}",
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
      }));
      render(
        <AppWrapper>
          <UserUpdate />
        </AppWrapper>
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
      }));
      render(
        <AppWrapper>
          <UserUpdate />
        </AppWrapper>
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
