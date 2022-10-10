import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
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
        tab: "Labels",
      },
    }));
  });
  describe("Labels", () => {
    it("should display reference labels", async () => {
      render(
        <AppWrapper>
          <EntityRelationsSettings />
        </AppWrapper>
      );

      const currentTab = screen.getByRole("tabpanel");

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
        <AppWrapper>
          <EntityRelationsSettings />
        </AppWrapper>
      );

      const currentTab = screen.getByRole("tabpanel");

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
        within(currentTab).getByRole("button", { name: "Save Labels" })
      );
      expect(await screen.findByRole("status")).toHaveTextContent(
        "App Settings Saved Successfully"
      );
    });

    it("should display updated labels", async () => {
      render(
        <AppWrapper>
          <EntityRelationsSettings />
        </AppWrapper>
      );

      const currentTab = screen.getByRole("tabpanel");

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
