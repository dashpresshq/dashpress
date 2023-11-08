import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import AccountPassword from "pages/account/password";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("pages/account/password", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should update password", async () => {
    render(
      <ApplicationRoot>
        <AccountPassword />
      </ApplicationRoot>
    );
    await userEvent.type(
      await screen.findByLabelText("Old Password"),
      "Old Password"
    );
    await userEvent.type(screen.getByLabelText("New Password"), "New Password");
    await userEvent.type(
      screen.getByLabelText("New Password Again"),
      "New Password"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Update Password" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Password Updated Successfully"
    );
  });

  it("should show different error message on demo", async () => {
    process.env.NEXT_PUBLIC_IS_DEMO = "true";

    render(
      <ApplicationRoot>
        <AccountPassword />
      </ApplicationRoot>
    );

    await userEvent.type(
      await screen.findByLabelText("Old Password"),
      "Old Password"
    );
    await userEvent.type(screen.getByLabelText("New Password"), "New Password");
    await userEvent.type(
      screen.getByLabelText("New Password Again"),
      "New Password"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Update Password" })
    );

    expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
      "Password will not be changed on demo account"
    );
  });
});
