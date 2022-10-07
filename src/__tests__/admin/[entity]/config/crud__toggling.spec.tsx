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

  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  describe.each([
    { tab: "Details" },
    { tab: "Create" },
    { tab: "Update" },
    { tab: "Delete" },
  ])("$tab feature", ({ tab }) => {
    beforeAll(() => {
      useRouter.mockImplementation(() => ({
        asPath: "/",
        query: {
          entity: "entity-1",
          tab,
        },
      }));
    });

    it("should toggle off functionality", async () => {
      render(
        <AppWrapper>
          <EntityCrudSettings />
        </AppWrapper>
      );

      await userEvent.click(
        await screen.findByRole("button", {
          name: `Disable ${tab} Functionality`,
        })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "App Settings Saved Successfully"
      );

      expect(
        screen.queryByRole("button", {
          name: `Disable ${tab} Functionality`,
        })
      ).not.toBeInTheDocument();
    });

    it("should toggle on functionality", async () => {
      render(
        <AppWrapper>
          <EntityCrudSettings />
        </AppWrapper>
      );

      await userEvent.click(
        await screen.findByRole("button", {
          name: `Enable ${tab} Functionality`,
        })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "App Settings Saved Successfully"
      );

      expect(
        screen.queryByRole("button", {
          name: `Enable ${tab} Functionality`,
        })
      ).not.toBeInTheDocument();
    });
  });
});
