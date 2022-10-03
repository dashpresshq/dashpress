import * as React from "react";
import { render, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { rest } from "msw";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import UserSetup from "pages/setup/user";

const server = setupApiHandlers();

describe("pages/setup/user", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    localStorage.clear();
  });

  it("should redirect to credentials if when credentials is not setup", async () => {
    const replaceMock = jest.fn();
    useRouter.mockImplementation(() => ({
      replace: replaceMock,
      query: {},
    }));

    server.use(
      rest.get(BASE_TEST_URL("/api/setup/check"), async (_, res, ctx) => {
        return res(
          ctx.json({
            hasUsers: true,
            hasDbCredentials: false,
          })
        );
      })
    );

    render(
      <AppWrapper>
        <UserSetup />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/setup/credentials");
    });
  });
});
