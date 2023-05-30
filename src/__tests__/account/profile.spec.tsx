import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import AccountProfile from "pages/account/profile";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

jest.mock("next/router", () => require("next-router-mock"));

describe("pages/account/profile", () => {
  it("should display profile details", async () => {
    render(
      <AppWrapper>
        <AccountProfile />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("Root User");
    });
  });

  it("should update profile successfully", async () => {
    render(
      <AppWrapper>
        <AccountProfile />
      </AppWrapper>
    );

    await userEvent.clear(screen.getByLabelText("Name"));

    await userEvent.type(screen.getByLabelText("Name"), "Updated Name");

    await userEvent.click(
      screen.getByRole("button", { name: "Save Account Profile" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Account Profile Saved Successfully"
    );
  });

  it("should display updated profile details", async () => {
    render(
      <AppWrapper>
        <AccountProfile />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("Updated Name");
    });
  });
});
