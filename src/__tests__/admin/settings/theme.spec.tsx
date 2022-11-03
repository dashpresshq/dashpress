/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
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
    const { container } = render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Dark Color Scheme")).toHaveValue("#111111");
    });

    expect(container.querySelector(`input[name="theme"]`)).toHaveValue("dark");
  });

  it("should update theme settings successfully", async () => {
    render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );

    fireEvent.input(screen.getByLabelText("Dark Color Scheme"), {
      target: { value: "#123456" },
    });

    await userEvent.click(screen.getByRole("button", { name: "Update Theme" }));

    expect((await screen.findAllByRole("status"))[1]).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });

  it("should display updated theme values", async () => {
    const { container } = render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Dark Color Scheme")).toHaveValue("#123456");
    });
    expect(container.querySelector(`input[name="theme"]`)).toHaveValue("dark");
  });

  it("should update user preference and switch color successfully", async () => {
    render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );

    expect(screen.getByLabelText("Dark Color Scheme")).toBeInTheDocument();

    expect(
      screen.queryByLabelText("Light Color Scheme")
    ).not.toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Theme"), "Light");
    await userEvent.keyboard("{Enter}");

    expect(
      screen.queryByLabelText("Dark Color Scheme")
    ).not.toBeInTheDocument();

    expect(screen.getByLabelText("Light Color Scheme")).toHaveValue("#459211");

    fireEvent.input(screen.getByLabelText("Light Color Scheme"), {
      target: { value: "#654321" },
    });

    await userEvent.click(screen.getByRole("button", { name: "Update Theme" }));

    expect((await screen.findAllByRole("status"))[2]).toHaveTextContent(
      "Preferences Updated Successfully"
    );

    expect((await screen.findAllByRole("status"))[3]).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });

  it("should display updated theme values", async () => {
    const { container } = render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Light Color Scheme")).toHaveValue(
        "#654321"
      );
    });

    expect(
      screen.queryByLabelText("Dark Color Scheme")
    ).not.toBeInTheDocument();

    expect(container.querySelector(`input[name="theme"]`)).toHaveValue("light");
  });

  it("should display not update the other scheme color", async () => {
    render(
      <AppWrapper>
        <ThemeSettings />
      </AppWrapper>
    );
    await userEvent.type(screen.getByLabelText("Theme"), "Dark");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByLabelText("Dark Color Scheme")).toHaveValue("#123456");
  });
});
