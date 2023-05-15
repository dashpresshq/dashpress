import * as React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { rest } from "msw";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import UserSetup from "pages/setup/user";
import userEvent from "@testing-library/user-event";

const server = setupApiHandlers();

describe("pages/setup/user", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    localStorage.clear();
  });

  it("should create new user successfully", async () => {
    server.resetHandlers();
    localStorage.clear();
    const pushMock = jest.fn();
    useRouter.mockImplementation(() => ({
      query: {},
      push: pushMock,
    }));

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
      <AppWrapper>
        <UserSetup />
      </AppWrapper>
    );

    await userEvent.type(
      await screen.findByLabelText("Username"),
      "testusername"
    );
    await userEvent.type(screen.getByLabelText("Name"), "testname");
    await userEvent.type(screen.getByLabelText("Password"), "Some Password");

    await userEvent.click(
      screen.getByRole("button", { name: "Setup Account" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "User Created Successfully"
    );

    expect(pushMock).toHaveBeenCalledWith("/");
  });
});
