import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserCreate from "pages/users/create";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { expectToast } from "../_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/users/create", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should create new user", async () => {
    const pushMock = jest.fn();

    useRouter.mockImplementation(USE_ROUTER_PARAMS({ pushMock }));

    render(
      <TestProviders>
        <UserCreate />
      </TestProviders>
    );

    await userEvent.type(
      await screen.findByLabelText("Username"),
      "someusername"
    );
    await userEvent.type(screen.getByLabelText("Name"), "Some Name");

    await userEvent.type(await screen.findByLabelText("Role"), "Viewer");

    await userEvent.keyboard("{Enter}");

    await userEvent.type(screen.getByLabelText("Password"), "Password");

    await userEvent.click(screen.getByRole("button", { name: "Create User" }));

    await expectToast("User Created SuccessfullyView Details");

    await userEvent.click(screen.getByRole("button", { name: "View Details" }));

    expect(pushMock).toHaveBeenCalledWith("/users/someusername");
  });
});
