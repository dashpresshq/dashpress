import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import EntityCrudSettings from "@/pages/admin/[entity]/config/crud";
import { sluggify } from "@/shared/lib/strings";
import { BASE_TEST_URL } from "@/tests/api/handlers/_utils";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

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
      <TestProviders>
        <EntityCrudSettings />
      </TestProviders>
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
      <TestProviders>
        <EntityCrudSettings />
      </TestProviders>
    );

    expect(
      screen.queryByRole("button", {
        name: `Enable ${tab} Functionality`,
      })
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: tab }));

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(tab);

    expect(
      await screen.findByRole("button", {
        name: `Enable ${tab} Functionality`,
      })
    ).toBeInTheDocument();

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
          tab: "delete",
        },
      })
    );

    render(
      <TestProviders>
        <EntityCrudSettings />
      </TestProviders>
    );

    expect(
      await screen.findByRole("button", {
        name: "Enable Delete Functionality",
      })
    ).toBeInTheDocument();

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
      })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("tab", {
        selected: true,
      })
    ).toHaveTextContent("Table");

    expect(replaceMock$1).toHaveBeenCalledWith("/?tab=table");
  });
});
