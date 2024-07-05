import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EntityRelationsSettings from "pages/admin/[entity]/config/relations";

import { getToastMessage } from "@/__tests__/_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/admin/[entity]/config/relations", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          entity: "entity-1",
          tab: "selection",
        },
      })
    );
  });

  describe("Selection", () => {
    it("should display all related entities in correct state", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Selection",
      });

      await waitFor(async () => {
        expect(
          await within(currentTab).findByRole("switch", {
            name: "Plural hidden-related-entity-5",
          })
        ).not.toBeChecked();
      });

      expect(
        within(currentTab).getByRole("switch", {
          name: "Custom Label For Entity 2",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("switch", {
          name: "Plural related-entity-3",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("switch", {
          name: "Custom Label For Entity 4",
        })
      ).toBeChecked();
    });

    it("should save toggled state successfully", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Selection",
      });

      await userEvent.click(
        within(currentTab).getByRole("switch", {
          name: "Custom Label For Entity 4",
        })
      );
      await userEvent.click(
        within(currentTab).getByRole("switch", {
          name: "Plural related-entity-3",
        })
      );
      await userEvent.click(
        within(currentTab).getByRole("switch", {
          name: "Plural related-entity-3",
        })
      );
      await userEvent.click(
        within(currentTab).getByRole("switch", {
          name: "Plural hidden-related-entity-5",
        })
      );

      expect(await getToastMessage()).toBe(
        "Enabled Relations Saved Successfully"
      );
    });

    it("should display updated selection state", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Selection",
      });

      await waitFor(async () => {
        expect(
          await within(currentTab).findByRole("switch", {
            name: "Custom Label For Entity 4",
          })
        ).not.toBeChecked();
      });

      expect(
        within(currentTab).getByRole("switch", {
          name: "Custom Label For Entity 2",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("switch", {
          name: "Plural related-entity-3",
        })
      ).toBeChecked();

      expect(
        within(currentTab).getByRole("switch", {
          name: "Plural hidden-related-entity-5",
        })
      ).toBeChecked();
    });
  });
});
