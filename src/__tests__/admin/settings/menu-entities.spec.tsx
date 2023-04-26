import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import MenuEntitiesSettings from "pages/admin/settings/menu-entities";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/menu-entities", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {},
    }));
  });

  it("should display only active entities with correct state", async () => {
    render(
      <AppWrapper>
        <MenuEntitiesSettings />
      </AppWrapper>
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
      <AppWrapper>
        <MenuEntitiesSettings />
      </AppWrapper>
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

    await userEvent.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });

  it("should display updated entities state", async () => {
    render(
      <AppWrapper>
        <MenuEntitiesSettings />
      </AppWrapper>
    );

    await waitFor(async () => {
      expect(
        await screen.findByRole("checkbox", {
          name: "Plural entity-1",
        })
      ).not.toBeChecked();
    });

    expect(
      screen.getByRole("checkbox", { name: "Plural entity-3" })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Plural entity-2" })
    ).toBeChecked();
  });
});

// TODO test sorting
