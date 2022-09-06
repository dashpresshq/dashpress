import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import AccountPassword from "pages/account/password";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("pages/account/password", () => {
  it("should update password", async () => {
    render(
      <AppWrapper>
        <AccountPassword />
      </AppWrapper>
    );
    userEvent.type(screen.getByLabelText("Old Password"), "Old Password");
    userEvent.type(screen.getByLabelText("New Password"), "New Password");
    userEvent.type(screen.getByLabelText("New Password Again"), "New Password");

    await userEvent.click(
      screen.getByRole("button", { name: "Change Password" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Password Updated Successfully"
    );
  });
});
