import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import EntitiesSettings from "pages/admin/settings/entities";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/entities", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {},
      isReady: true,
    }));
  });

  it("should display all entities with correct state", async () => {
    render(
      <ApplicationRoot>
        <EntitiesSettings />
      </ApplicationRoot>
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

    expect(
      screen.getByRole("checkbox", { name: "Plural entity-4" })
    ).toBeInTheDocument();
  });

  it("should toggle entities state successfully", async () => {
    render(
      <ApplicationRoot>
        <EntitiesSettings />
      </ApplicationRoot>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Plural entity-1" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Plural entity-1" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Plural entity-2" })
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Plural disabled-entity-2" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Enabled Entities Settings Saved Successfully"
    );
  });

  it("should display updated entities state", async () => {
    render(
      <ApplicationRoot>
        <EntitiesSettings />
      </ApplicationRoot>
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
