import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import SystemSettings from "pages/admin/settings/system";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/system", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
    }));
  });

  it("display system values", async () => {
    render(
      <AppWrapper>
        <SystemSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(
        screen.getByLabelText("Token Validity Duration In Days")
      ).toHaveValue(5);
    });
    expect(screen.getByLabelText("Force Introspection")).toBeChecked();
  });

  it("update system settings successfully", async () => {
    render(
      <AppWrapper>
        <SystemSettings />
      </AppWrapper>
    );

    userEvent.type(
      screen.getByLabelText("Token Validity Duration In Days"),
      "5"
    );

    userEvent.click(screen.getByLabelText("Force Introspection"));

    await userEvent.click(
      screen.getByRole("button", { name: "Update System Settings" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });
});
