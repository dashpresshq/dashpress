import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import EntityCrudSettings from "pages/admin/[entity]/config/crud";
import { rest } from "msw";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";
import { sluggify } from "shared/lib/strings";
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
              isId: true,
              type: "number",
            },
          ])
        );
      }
    )
  );
  const replaceMock = jest.fn();

  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(
    USE_ROUTER_PARAMS({
      asPath: "/hello-there?foo=bar",
      replaceMock,
      query: {
        entity: "entity-1",
      },
    })
  );

  it("should defaults to table", async () => {
    render(
      <ApplicationRoot>
        <EntityCrudSettings />
      </ApplicationRoot>
    );

    expect(
      await screen.findByRole("tab", { selected: true })
    ).toHaveTextContent("Table");
  });

  it.each([
    { tab: "Details" },
    { tab: "Create" },
    { tab: "Update" },
    { tab: "Delete" },
  ])("should be tab-able to $tab", async ({ tab }) => {
    render(
      <ApplicationRoot>
        <EntityCrudSettings />
      </ApplicationRoot>
    );
    expect(
      await screen.findByRole("button", {
        name: `Enable ${tab} Functionality`,
        hidden: true,
      })
    ).not.toBeVisible();

    await userEvent.click(screen.getByRole("tab", { name: tab }));

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(tab);

    expect(
      await screen.findByRole("button", {
        name: `Enable ${tab} Functionality`,
      })
    ).toBeVisible();

    expect(replaceMock).toHaveBeenCalledWith(
      `/hello-there?foo=bar&tab=${sluggify(tab)}`
    );
  });

  it("should default to the tab from query and be to go back to table", async () => {
    const replaceMock$1 = jest.fn();

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        replaceMock: replaceMock$1,
        query: {
          entity: "entity-1",
          tab: "Delete",
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
        name: "Enable Delete Functionality",
      })
    ).toBeVisible();

    expect(
      screen.getByRole("tab", {
        selected: true,
      })
    ).toHaveTextContent("Delete");

    await userEvent.click(screen.getByRole("tab", { name: "Table" }));

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Table"
    );

    expect(
      screen.queryByRole("button", {
        name: "Enable Delete Functionality",
        hidden: true,
      })
    ).not.toBeVisible();

    expect(
      screen.getByRole("tab", {
        selected: true,
      })
    ).toHaveTextContent("Table");

    expect(replaceMock$1).toHaveBeenCalledWith("/?tab=table");
  });
});
