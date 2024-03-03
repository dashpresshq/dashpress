import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import EntityRelationsSettings from "pages/admin/[entity]/config/relations";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/config/relations", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
        tab: "Selection",
      },
      isReady: true,
    }));
  });
  describe("Selection", () => {
    it("should display all related entities in correct state", async () => {
      render(
        <ApplicationRoot>
          <EntityRelationsSettings />
        </ApplicationRoot>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Selection",
      });

      await waitFor(async () => {
        expect(
          await within(currentTab).findByRole("checkbox", {
            name: "Plural hidden-related-entity-5",
          })
        ).not.toBeChecked();
      });

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Custom Label For Entity 2",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Plural related-entity-3",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Custom Label For Entity 4",
        })
      ).toBeChecked();
    });

    it("should save toggled state successfully", async () => {
      render(
        <ApplicationRoot>
          <EntityRelationsSettings />
        </ApplicationRoot>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Selection",
      });

      await userEvent.click(
        within(currentTab).getByRole("button", {
          name: "Custom Label For Entity 4",
        })
      );
      await userEvent.click(
        within(currentTab).getByRole("button", {
          name: "Plural related-entity-3",
        })
      );
      await userEvent.click(
        within(currentTab).getByRole("button", {
          name: "Plural related-entity-3",
        })
      );
      await userEvent.click(
        within(currentTab).getByRole("button", {
          name: "Plural hidden-related-entity-5",
        })
      );

      expect(await screen.findByRole("status")).toHaveTextContent(
        "Enabled Relations Saved Successfully"
      );
    });

    it("should display updated selection state", async () => {
      render(
        <ApplicationRoot>
          <EntityRelationsSettings />
        </ApplicationRoot>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Selection",
      });

      await waitFor(async () => {
        expect(
          await within(currentTab).findByRole("checkbox", {
            name: "Custom Label For Entity 4",
          })
        ).not.toBeChecked();
      });

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Custom Label For Entity 2",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Plural related-entity-3",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("checkbox", {
          name: "Plural hidden-related-entity-5",
        })
      ).toBeChecked();
    });
  });
});
