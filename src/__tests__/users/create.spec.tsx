import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";

import UserCreate from "pages/users/create";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/users/create", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should create new user", async () => {
    const pushMock = jest.fn();
    useRouter.mockImplementation(() => ({
      asPath: "/",
      push: pushMock,
    }));
    render(
      <ApplicationRoot>
        <UserCreate />
      </ApplicationRoot>
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

    expect(await screen.findByRole("status")).toHaveTextContent(
      "User Created SuccessfullyClick here to view user"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Click here to view user" })
    );

    expect(pushMock).toHaveBeenCalledWith("/users/someusername");
  });
});
