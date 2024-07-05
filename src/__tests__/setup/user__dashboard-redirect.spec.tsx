import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import UserSetup from "pages/setup/user";
import * as React from "react";

const server = setupApiHandlers();

describe("pages/setup/user", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    localStorage.clear();
  });

  it("should redirect to dashboard if there are both users and credentials in setup", async () => {
    const replaceMock = jest.fn();

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        replaceMock,
      })
    );

    server.use(
      rest.get(BASE_TEST_URL("/api/setup/check"), async (_, res, ctx) => {
        return res(
          ctx.json({
            hasUsers: true,
            hasDbCredentials: true,
          })
        );
      })
    );

    render(
      <TestProviders>
        <UserSetup />
      </TestProviders>
    );
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/", "/", { locale: "en" });
    });
  });
});
