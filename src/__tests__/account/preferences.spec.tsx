/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import UserPreferences from "pages/account/preferences";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/account/preferences", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
    }));
  });

  it("should display user preferences", async () => {
    const { container } = render(
      <AppWrapper>
        <UserPreferences />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(container.querySelector(`input[name="theme"]`)).toHaveValue(
        "dark"
      );
    });
  });

  it("should update user preference", async () => {
    render(
      <AppWrapper>
        <UserPreferences />
      </AppWrapper>
    );
    await userEvent.type(screen.getByLabelText("Theme"), "Light");
    await userEvent.keyboard("{Enter}");

    await userEvent.click(
      screen.getByRole("button", { name: "Save Preferences" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Preferences Updated Successfully"
    );
  });

  it("should display updated preference", async () => {
    const { container } = render(
      <AppWrapper>
        <UserPreferences />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(container.querySelector(`input[name="theme"]`)).toHaveValue(
        "light"
      );
    });
  });
});
