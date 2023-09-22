import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import MenuSettings from "pages/admin/settings/menu";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/menu", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {},
    }));
  });

  it("should display only active entities with correct state", async () => {
    render(
      <ApplicationRoot>
        <MenuSettings />
      </ApplicationRoot>
    );

    await waitFor(async () => {
      expect(
        await screen.findByRole("checkbox", {
          name: "Plural entity-3",
        })
      ).not.toBeChecked();
    });

    expect(
      screen.getByRole("checkbox", { name: "Plural entity-1" })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Plural entity-2" })
    ).toBeChecked();

    expect(
      screen.queryByRole("checkbox", { name: "Plural entity-4" })
    ).not.toBeInTheDocument();
  });

  it("should toggle menu state successfully", async () => {
    render(
      <ApplicationRoot>
        <MenuSettings />
      </ApplicationRoot>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Plural entity-3" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Plural entity-1" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Plural entity-2" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Plural entity-2" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save Menu Entities Settings" })
    );

    expect(
      await screen.findByRole("status", {}, { timeout: 20000 })
    ).toHaveTextContent("Menu Entities Settings Saved Successfully");
  });

  it("should display updated entities state", async () => {
    render(
      <ApplicationRoot>
        <MenuSettings />
      </ApplicationRoot>
    );

    await waitFor(
      async () => {
        expect(
          await screen.findByRole("checkbox", {
            name: "Plural entity-1",
          })
        ).not.toBeChecked();
      },
      {
        timeout: 20000,
      }
    );

    expect(
      screen.getByRole("checkbox", { name: "Plural entity-3" })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Plural entity-2" })
    ).toBeChecked();
  });
});
