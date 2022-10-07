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

  describe("Details", () => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
        tab: "Details",
      },
    }));

    it("should go to toggle off details functionality", async () => {
      render(
        <AppWrapper>
          <EntityCrudSettings />
        </AppWrapper>
      );

      await userEvent.click(
        await screen.findByRole("button", {
          name: "Disable Details Functionality",
        })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "App Settings Saved Successfully"
      );

      expect(
        screen.queryByRole("button", {
          name: "Disable Details Functionality",
        })
      ).not.toBeInTheDocument();
    });

    it("should go to toggle on details functionality", async () => {
      render(
        <AppWrapper>
          <EntityCrudSettings />
        </AppWrapper>
      );

      await userEvent.click(
        await screen.findByRole("button", {
          name: "Enable Details Functionality",
        })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "App Settings Saved Successfully"
      );

      expect(
        screen.queryByRole("button", {
          name: "Enable Details Functionality",
        })
      ).not.toBeInTheDocument();
    });
  });
});
