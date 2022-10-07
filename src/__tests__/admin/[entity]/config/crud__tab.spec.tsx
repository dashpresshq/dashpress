import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import EntityCrudSettings from "pages/admin/[entity]/config/crud";
import { rest } from "msw";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { BASE_TEST_URL } from "__tests__/_/api-handlers/_utils";

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
  useRouter.mockImplementation(() => ({
    asPath: "/hello-there?foo=bar",
    replace: replaceMock,
    query: {
      entity: "entity-1",
    },
  }));

  it("should defaults to table", async () => {
    render(
      <AppWrapper>
        <EntityCrudSettings />
      </AppWrapper>
    );

    expect(
      await screen.findByRole("tab", { selected: true })
    ).toHaveTextContent("Table");
  });

  it("should go to details", async () => {
    render(
      <AppWrapper>
        <EntityCrudSettings />
      </AppWrapper>
    );
    expect(
      await screen.findByRole("button", {
        name: "Disable Details Functionality",
        hidden: true,
      })
    ).not.toBeVisible();

    await userEvent.click(screen.getByRole("tab", { name: "Details" }));

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Details"
    );

    expect(
      await screen.findByRole("button", {
        name: "Disable Details Functionality",
      })
    ).toBeVisible();

    expect(replaceMock).toHaveBeenCalledWith(
      "/hello-there?foo=bar&tab=Details"
    );
  });

  it("should go to create", async () => {
    render(
      <AppWrapper>
        <EntityCrudSettings />
      </AppWrapper>
    );
    expect(
      screen.queryByRole("button", {
        name: "Disable Create Functionality",
        hidden: true,
      })
    ).not.toBeVisible();

    await userEvent.click(screen.getByRole("tab", { name: "Create" }));

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Create"
    );

    expect(
      screen.getByRole("button", { name: "Disable Create Functionality" })
    ).toBeVisible();

    expect(replaceMock).toHaveBeenCalledWith("/hello-there?foo=bar&tab=Create");
  });

  it("should go to update", async () => {
    render(
      <AppWrapper>
        <EntityCrudSettings />
      </AppWrapper>
    );
    expect(
      screen.queryByRole("button", {
        name: "Disable Update Functionality",
        hidden: true,
      })
    ).not.toBeVisible();

    await userEvent.click(screen.getByRole("tab", { name: "Update" }));

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Update"
    );

    expect(
      screen.getByRole("button", { name: "Disable Update Functionality" })
    ).toBeVisible();

    expect(replaceMock).toHaveBeenCalledWith("/hello-there?foo=bar&tab=Update");
  });

  it("should go to delete", async () => {
    render(
      <AppWrapper>
        <EntityCrudSettings />
      </AppWrapper>
    );

    expect(
      screen.queryByRole("button", {
        name: "Disable Delete Functionality",
        hidden: true,
      })
    ).not.toBeVisible();

    await userEvent.click(screen.getByRole("tab", { name: "Delete" }));

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Delete"
    );

    expect(
      screen.getByRole("button", { name: "Disable Delete Functionality" })
    ).toBeVisible();

    expect(replaceMock).toHaveBeenCalledWith("/hello-there?foo=bar&tab=Delete");
  });

  it("should default to the tab from query and be to go back to table", async () => {
    const replaceMock$1 = jest.fn();

    useRouter.mockImplementation(() => ({
      asPath: "/",
      replace: replaceMock$1,
      query: {
        entity: "entity-1",
        tab: "Delete",
      },
    }));
    render(
      <AppWrapper>
        <EntityCrudSettings />
      </AppWrapper>
    );

    expect(
      await screen.findByRole("button", {
        name: "Disable Delete Functionality",
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
        name: "Disable Delete Functionality",
        hidden: true,
      })
    ).not.toBeVisible();

    expect(
      screen.getByRole("tab", {
        selected: true,
      })
    ).toHaveTextContent("Table");

    expect(replaceMock$1).toHaveBeenCalledWith("/?tab=Table");
  });
});
