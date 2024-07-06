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
          tab: "labels",
        },
      })
    );
  });

  describe("Labels", () => {
    it("should display reference labels", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Labels",
      });

      await waitFor(() => {
        expect(
          within(currentTab).getByLabelText("related-entity-2")
        ).toHaveValue("Custom Label For Entity 2");
      });

      expect(within(currentTab).getByLabelText("related-entity-3")).toHaveValue(
        ""
      );
      expect(within(currentTab).getByLabelText("related-entity-4")).toHaveValue(
        "Custom Label For Entity 4"
      );

      expect(
        within(currentTab).queryByLabelText("hidden-related-entity-5")
      ).not.toBeInTheDocument();
    });

    it("should save labels", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Labels",
      });

      await userEvent.clear(
        await within(currentTab).findByLabelText("related-entity-2")
      );

      await userEvent.type(
        within(currentTab).getByLabelText("related-entity-3"),
        "Custom Label For Entity 3"
      );

      await userEvent.type(
        within(currentTab).getByLabelText("related-entity-4"),
        "Updated"
      );

      await userEvent.click(
        within(currentTab).getByRole("button", {
          name: "Save Relation Labels",
        })
      );
      expect(await getToastMessage()).toBe(
        "Relation Labels Saved Successfully"
      );
    });

    it("should display updated labels", async () => {
      render(
        <TestProviders>
          <EntityRelationsSettings />
        </TestProviders>
      );

      const currentTab = await screen.findByRole("tabpanel", {
        name: "Labels",
      });

      await waitFor(() => {
        expect(
          within(currentTab).getByLabelText("related-entity-2")
        ).toHaveValue("");
      });

      expect(within(currentTab).getByLabelText("related-entity-3")).toHaveValue(
        "Custom Label For Entity 3"
      );
      expect(within(currentTab).getByLabelText("related-entity-4")).toHaveValue(
        "Custom Label For Entity 4Updated"
      );
    });
  });
});
