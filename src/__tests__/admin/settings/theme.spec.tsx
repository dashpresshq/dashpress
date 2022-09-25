import "@testing-library/jest-dom";
import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import ThemeSettings from "pages/admin/settings/theme";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/theme", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
    }));
  });

  it("should display theme values", async () => {
    render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Primary")).toHaveValue("#459211");
    });
  });

  it("should update system settings successfully", async () => {
    render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );

    fireEvent.input(screen.getByLabelText("Primary"), {
      target: { value: "#111111" },
    });

    await userEvent.click(screen.getByRole("button", { name: "Update Theme" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });

  it("should display updated theme values", async () => {
    render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Primary")).toHaveValue("#111111");
    });
  });
});
