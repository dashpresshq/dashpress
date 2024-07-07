import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EntitiesSettings from "@/pages/admin/settings/entities";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";
import { getToastMessage } from "@/tests/utils";

setupApiHandlers();

describe("pages/admin/settings/entities", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("should display all entities with correct state", async () => {
    render(
      <TestProviders>
        <EntitiesSettings />
      </TestProviders>
    );

    await waitFor(async () => {
      expect(
        await screen.findByRole("switch", {
          name: "Plural disabled-entity-1",
        })
      ).not.toBeChecked();
    });

    expect(
      screen.getByRole("switch", { name: "Plural disabled-entity-2" })
    ).not.toBeChecked();

    expect(
      screen.getByRole("switch", { name: "Plural entity-1" })
    ).toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Plural entity-2" })
    ).toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Plural entity-3" })
    ).toBeChecked();

    expect(
      screen.getByRole("switch", { name: "Plural entity-4" })
    ).toBeInTheDocument();
  });

  it("should toggle entities state successfully", async () => {
    render(
      <TestProviders>
        <EntitiesSettings />
      </TestProviders>
    );

    await userEvent.click(
      screen.getByRole("switch", { name: "Plural entity-1" })
    );

    await userEvent.click(
      screen.getByRole("switch", { name: "Plural entity-1" })
    );

    await userEvent.click(
      screen.getByRole("switch", { name: "Plural entity-2" })
    );

    await userEvent.click(
      screen.getByRole("switch", { name: "Plural disabled-entity-2" })
    );

    expect(await getToastMessage()).toBe(
      "Enabled Entities Settings Saved Successfully"
    );
  });

  it("should display updated entities state", async () => {
    render(
      <TestProviders>
        <EntitiesSettings />
      </TestProviders>
    );

    expect(
      screen.getByRole("switch", { name: "Plural entity-1" })
    ).toBeChecked();

    await waitFor(() => {
      expect(
        screen.getByRole("switch", { name: "Plural entity-2" })
      ).not.toBeChecked();
    });

    expect(
      screen.getByRole("switch", { name: "Plural entity-3" })
    ).toBeChecked();

    expect(
      screen.getByRole("switch", { name: "Plural disabled-entity-1" })
    ).not.toBeChecked();
    expect(
      screen.getByRole("switch", { name: "Plural disabled-entity-2" })
    ).toBeChecked();
  });
});
