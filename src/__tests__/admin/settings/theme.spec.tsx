import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
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
      <ApplicationRoot>
        <ThemeSettings />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Dark Color Scheme")).toHaveValue("#111111");
    });

    expect(screen.getByRole("option", { selected: true })).toHaveTextContent(
      "Dark"
    );
  });

  it("should update theme settings successfully", async () => {
    render(
      <ApplicationRoot>
        <ThemeSettings />
      </ApplicationRoot>
    );

    fireEvent.input(screen.getByLabelText("Dark Color Scheme"), {
      target: { value: "#123456" },
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Save Theme Settings" })
    );

    expect((await screen.findAllByRole("status"))[1]).toHaveTextContent(
      "Theme Preference Saved Successfully"
    );
  });

  it("should display updated theme values", async () => {
    render(
      <ApplicationRoot>
        <ThemeSettings />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Dark Color Scheme")).toHaveValue("#123456");
    });
    expect(screen.getByRole("option", { selected: true })).toHaveTextContent(
      "Dark"
    );
  });

  it("should update user preference and switch color successfully", async () => {
    render(
      <ApplicationRoot>
        <ThemeSettings />
      </ApplicationRoot>
    );

    expect(screen.getByLabelText("Dark Color Scheme")).toBeInTheDocument();

    expect(
      screen.queryByLabelText("Light Color Scheme")
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("option", { name: "Light" }));

    expect(
      screen.queryByLabelText("Dark Color Scheme")
    ).not.toBeInTheDocument();

    expect(screen.getByLabelText("Light Color Scheme")).toHaveValue("#4b38b3");

    fireEvent.input(screen.getByLabelText("Light Color Scheme"), {
      target: { value: "#654321" },
    });

    await userEvent.click(
      screen.getByRole("button", { name: "Save Theme Settings" })
    );

    expect((await screen.findAllByRole("status"))[2]).toHaveTextContent(
      "Theme Settings Saved Successfully"
    );

    expect((await screen.findAllByRole("status"))[3]).toHaveTextContent(
      "Theme Preference Saved Successfully"
    );
  });

  it("should display updated theme values", async () => {
    render(
      <ApplicationRoot>
        <ThemeSettings />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Light Color Scheme")).toHaveValue(
        "#654321"
      );
    });

    expect(
      screen.queryByLabelText("Dark Color Scheme")
    ).not.toBeInTheDocument();

    expect(screen.getByRole("option", { selected: true })).toHaveTextContent(
      "Light"
    );
  });

  it("should not display the other scheme color", async () => {
    render(
      <ApplicationRoot>
        <ThemeSettings />
      </ApplicationRoot>
    );
    await userEvent.click(screen.getByRole("option", { name: "Dark" }));

    await userEvent.keyboard("{Enter}");

    expect(screen.getByLabelText("Dark Color Scheme")).toHaveValue("#123456");
  });
});
