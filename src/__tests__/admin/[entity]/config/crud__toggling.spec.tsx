import { render, screen, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import EntityCrudSettings from "pages/admin/[entity]/config/crud";
import { rest } from "msw";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";

const server = setupApiHandlers();

describe("pages/admin/[entity]/config/crud", () => {
  server.use(
    rest.get(
      BASE_TEST_URL("/api/entities/:entity/fields"),
      async (_, res, ctx) => {
        return res(
          ctx.json([
            {
              name: `field-1`,
              isRequired: true,
              type: "number",
            },
          ])
        );
      }
    )
  );

  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  it("should not have toggling functionality for tables", async () => {
    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          entity: "entity-1",
        },
      })
    );

    render(
      <ApplicationRoot>
        <EntityCrudSettings />
      </ApplicationRoot>
    );

    expect(
      await screen.findByRole("button", {
        name: `Enable Create Functionality`,
        hidden: true,
      })
    ).not.toBeVisible();

    expect(
      await screen.findByRole("tab", { selected: true })
    ).toHaveTextContent("Table");

    expect(
      screen.queryByRole("button", {
        name: `Disable Table Functionality`,
      })
    ).not.toBeInTheDocument();
  });

  describe.each([
    { tab: "Update" },
    { tab: "Details" },
    { tab: "Create" },
    { tab: "Delete" },
  ])("$tab feature", ({ tab }) => {
    beforeAll(() => {
      useRouter.mockImplementation(
        USE_ROUTER_PARAMS({
          query: {
            entity: "entity-1",
            tab,
          },
        })
      );
    });

    it("should toggle off functionality", async () => {
      render(
        <ApplicationRoot>
          <EntityCrudSettings />
        </ApplicationRoot>
      );

      const currentTab = screen.getByRole("tabpanel", { name: tab });

      if (tab !== "Delete") {
        expect(
          await within(currentTab).findByRole("checkbox", { name: "Field 1" })
        ).toBeInTheDocument();
      }

      await userEvent.click(
        await within(currentTab).findByRole("button", {
          name: `Enable ${tab} Functionality`,
        })
      );
      if (tab !== "Delete") {
        expect(
          within(currentTab).queryByRole("checkbox", { name: "Field 1" })
        ).not.toBeInTheDocument();
      }

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "CRUD Settings Saved Successfully"
      );
    });

    it("should toggle on functionality", async () => {
      render(
        <ApplicationRoot>
          <EntityCrudSettings />
        </ApplicationRoot>
      );

      const currentTab = screen.getByRole("tabpanel", { name: tab });

      if (tab !== "Delete") {
        expect(
          within(currentTab).queryByRole("checkbox", { name: "Field 1" })
        ).not.toBeInTheDocument();
      }

      await userEvent.click(
        await within(currentTab).findByRole("button", {
          name: `Enable ${tab} Functionality`,
        })
      );
      if (tab !== "Delete") {
        expect(
          within(currentTab).getByRole("checkbox", { name: "Field 1" })
        ).toBeInTheDocument();
      }
      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "CRUD Settings Saved Successfully"
      );
    });
  });
});
