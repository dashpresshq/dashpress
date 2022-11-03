import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import EntitiesSettings from "pages/admin/settings/entities";
import EntitiesSettings1 from "pages/admin/settings";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/entities", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {},
    }));
  });

  it("should display all entities with correct state", async () => {
    render(
      <AppWrapper>
        <EntitiesSettings1 />
      </AppWrapper>
    );

    await waitFor(async () => {
      expect(
        await screen.findByRole("checkbox", {
          name: "Plural disabled-entity-1",
        })
      ).not.toBeChecked();
    });

    expect(
      screen.getByRole("checkbox", { name: "Plural disabled-entity-2" })
    ).not.toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Plural entity-1" })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Plural entity-2" })
    ).toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Plural entity-3" })
    ).toBeChecked();
  });

  it("should toggle entities state successfully", async () => {
    render(
      <AppWrapper>
        <EntitiesSettings />
      </AppWrapper>
    );

    await userEvent.click(
      screen.getByRole("checkbox", { name: "Plural entity-1" })
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Plural entity-1" })
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Plural entity-2" })
    );
    await userEvent.click(
      screen.getByRole("checkbox", { name: "Plural disabled-entity-2" })
    );

    await userEvent.click(
      screen.getAllByRole("button", { name: "Save Changes" })[0]
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "App Settings Saved Successfully"
    );
  });

  it("should display updated entities state", async () => {
    render(
      <AppWrapper>
        <EntitiesSettings />
      </AppWrapper>
    );

    expect(
      screen.getByRole("checkbox", { name: "Plural entity-1" })
    ).toBeChecked();

    await waitFor(() => {
      expect(
        screen.getByRole("checkbox", { name: "Plural entity-2" })
      ).not.toBeChecked();
    });

    expect(
      screen.getByRole("checkbox", { name: "Plural entity-3" })
    ).toBeChecked();

    expect(
      screen.getByRole("checkbox", { name: "Plural disabled-entity-1" })
    ).not.toBeChecked();
    expect(
      screen.getByRole("checkbox", { name: "Plural disabled-entity-2" })
    ).toBeChecked();
  });
});

// TODO test sorting
