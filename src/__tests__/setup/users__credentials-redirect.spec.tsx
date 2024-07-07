import { render, waitFor } from "@testing-library/react";
import { rest } from "msw";
import * as React from "react";

import UserSetup from "@/pages/setup/user";
import { BASE_TEST_URL } from "@/tests/api/handlers/_utils";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

const server = setupApiHandlers();

describe("pages/setup/user", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    localStorage.clear();
  });

  it("should redirect to credentials if when credentials is not setup", async () => {
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
            hasDbCredentials: false,
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
      expect(replaceMock).toHaveBeenCalledWith(
        "/setup/credentials",
        "/setup/credentials",
        { locale: "en" }
      );
    });
  });
});
