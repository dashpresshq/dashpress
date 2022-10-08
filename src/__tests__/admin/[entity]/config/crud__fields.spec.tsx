import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
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
              name: `primary`,
              isId: true,
              type: "number",
            },
            {
              name: `field-1`,
              isRequired: true,
              type: "number",
            },
            {
              name: `field-2`,
              isRequired: true,
              type: "string",
            },
            {
              name: `hidden-field-1`,
              type: "string",
            },
          ])
        );
      }
    )
  );

  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  describe.each([
    { tab: "Table" },
    { tab: "Details" },
    { tab: "Create" },
    { tab: "Update" },
  ])("$tab Tab", ({ tab }) => {
    beforeEach(() => {
      useRouter.mockImplementation(() => ({
        asPath: "/",
        query: {
          entity: "entity-1",
          tab,
        },
      }));
    });

    it("should show current state correctly", async () => {
      render(
        <AppWrapper>
          <EntityCrudSettings />
        </AppWrapper>
      );

      const currentTab = screen.getByRole("tabpanel");

      await waitFor(() => {
        expect(
          within(currentTab).getByRole("checkbox", {
            name: "Hidden Field 1",
          })
        ).not.toBeChecked();
      });

      expect(
        await within(currentTab).findByRole("checkbox", { name: "Field 1" })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Field 1",
        })
      ).toBeChecked();
    });

    it("should change state correctly", async () => {
      render(
        <AppWrapper>
          <EntityCrudSettings />
        </AppWrapper>
      );

      const currentTab = screen.getByRole("tabpanel");

      await userEvent.click(
        await within(currentTab).findByRole("checkbox", { name: "Field 1" })
      );

      await userEvent.click(
        within(currentTab).getByRole("checkbox", { name: "Field 2" })
      );
      await userEvent.click(
        within(currentTab).getByRole("checkbox", { name: "Field 2" })
      );

      await userEvent.click(
        within(currentTab).getByRole("checkbox", { name: "Hidden Field 1" })
      );

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save Changes" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "App Settings Saved Successfully"
      );
    });

    it("should show updated state correctly", async () => {
      render(
        <AppWrapper>
          <EntityCrudSettings />
        </AppWrapper>
      );

      const currentTab = screen.getByRole("tabpanel");

      await waitFor(async () => {
        expect(
          await within(currentTab).findByRole("checkbox", { name: "Field 1" })
        ).not.toBeChecked();
      });

      expect(
        await within(currentTab).findByRole("checkbox", {
          name: "Field 2",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Hidden Field 1",
        })
      ).toBeChecked();
    });
  });

  it("should show Id field for only details and table and not update and create", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
      replace: jest.fn(),
    }));
    render(
      <AppWrapper>
        <EntityCrudSettings />
      </AppWrapper>
    );

    expect(
      await screen.findByRole("checkbox", {
        name: "Primary",
      })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Details" }));

    expect(
      await screen.findByRole("checkbox", {
        name: "Primary",
      })
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Create" }));

    expect(
      screen.queryByRole("checkbox", {
        name: "Primary",
      })
    ).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Update" }));

    expect(
      screen.queryByRole("checkbox", {
        name: "Primary",
      })
    ).not.toBeInTheDocument();
  });

  it("should not have toggling functionality for delete", async () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
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

    expect(screen.getByRole("tab", { selected: true })).toHaveTextContent(
      "Delete"
    );

    expect(
      screen.queryByRole("checkbox", {
        name: "Primary",
      })
    ).not.toBeInTheDocument();

    expect(
      screen.queryByRole("checkbox", {
        name: "Field 1",
      })
    ).not.toBeInTheDocument();
  });
});
