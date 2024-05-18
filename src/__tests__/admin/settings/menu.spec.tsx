import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MenuSettings from "pages/admin/settings/menu";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";

setupApiHandlers();

describe("pages/admin/settings/menu", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("should display only active entities with correct state", async () => {
    render(
      <TestProviders>
        <MenuSettings />
      </TestProviders>
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
      <TestProviders>
        <MenuSettings />
      </TestProviders>
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

    expect(
      await screen.findByRole("status", {}, { timeout: 20000 })
    ).toHaveTextContent("Menu Settings Saved Successfully");
  });

  it("should display updated entities state", async () => {
    render(
      <TestProviders>
        <MenuSettings />
      </TestProviders>
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
