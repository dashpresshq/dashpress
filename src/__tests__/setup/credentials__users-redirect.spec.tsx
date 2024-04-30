import * as React from "react";
import { render, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { rest } from "msw";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import CredentialsSetup from "pages/setup/credentials";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";

const server = setupApiHandlers();

/*
// TODO implement commment
 Because react-query caches the get responses and there is no external way of clearing it
 As the way to clear is through hooks and that wont work here
 So to simulate multiple setup check responses 
 A new file has to be created for all the difference cases
 :face-palm
*/

describe("pages/setup/credentials", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    localStorage.clear();
  });

  it("should redirect to users page DB credentials is set", async () => {
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
            hasUsers: false,
            hasDbCredentials: true,
          })
        );
      })
    );

    render(
      <ApplicationRoot>
        <CredentialsSetup />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/setup/user");
    });
  });
});
