import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";

import EntityFormExtensionSettings from "pages/admin/[entity]/config/form";

setupApiHandlers();

describe("pages/admin/[entity]/config/form", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(() => ({
    asPath: "/",
    query: {
      entity: "entity-1",
    },
  }));

  describe.each([
    { section: "fieldsState", label: "Fields State" },
    { section: "beforeSubmit", label: "Before Submit" },
    { section: "afterSubmit", label: "After Submit" },
  ])("$section section", ({ label, section }) => {
    it("should show current section value", async () => {
      render(
        <AppWrapper>
          <EntityFormExtensionSettings />
        </AppWrapper>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      expect(
        await within(screen.getByRole("tabpanel")).findByLabelText(`Script`)
      ).toHaveValue(section);
    });

    it("should update current section value correctly", async () => {
      render(
        <AppWrapper>
          <EntityFormExtensionSettings />
        </AppWrapper>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel");

      await userEvent.type(
        within(currentTab).getByLabelText("Script"),
        "Updated"
      );

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "App Settings Saved Successfully"
      );
    });

    it("should display updated section value", async () => {
      render(
        <AppWrapper>
          <EntityFormExtensionSettings />
        </AppWrapper>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel");

      expect(within(currentTab).getByLabelText("Script")).toHaveValue(
        `${section}Updated`
      );
    });

    it("should be able to be cleared", async () => {
      render(
        <AppWrapper>
          <EntityFormExtensionSettings />
        </AppWrapper>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel");

      await userEvent.clear(within(currentTab).getByLabelText("Script"));

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "App Settings Saved Successfully"
      );
    });

    it("should display cleared value correctly", async () => {
      render(
        <AppWrapper>
          <EntityFormExtensionSettings />
        </AppWrapper>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel");

      expect(within(currentTab).getByLabelText("Script")).toHaveValue(``);
    });
  });
});
