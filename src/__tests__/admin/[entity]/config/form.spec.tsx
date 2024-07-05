/* eslint-disable no-useless-escape */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";

import EntityFormExtensionSettings from "pages/admin/[entity]/config/form";
import {
  closeAllToasts,
  getToastMessage,
} from "__tests__/_/utils/closeAllToasts";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";

setupApiHandlers();

describe("pages/admin/[entity]/config/form", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  useRouter.mockImplementation(
    USE_ROUTER_PARAMS({
      query: {
        entity: "entity-1",
      },
    })
  );

  describe.each([
    {
      section: "fieldsState",
      label: "Fields State",
      validInput: `return {{name: {{hidden: true}}`,
      valid: `return {name: {hidden: true}}`,
    },
    {
      section: "beforeSubmit",
      label: "Before Submit",
      validInput: `return {{...$.formValues, custom: "Yes"}`,
      valid: `return {...$.formValues, custom: "Yes"}`,
    },
  ])("$section section", ({ label, section, valid, validInput }) => {
    it("should show current section value", async () => {
      render(
        <TestProviders>
          <EntityFormExtensionSettings />
        </TestProviders>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      expect(
        await within(
          screen.getByRole("tabpanel", { name: label })
        ).findByLabelText(`Script`)
      ).toHaveValue(section);
    });

    it("should update when provided value correctly", async () => {
      render(
        <TestProviders>
          <EntityFormExtensionSettings />
        </TestProviders>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      await userEvent.clear(within(currentTab).getByLabelText("Script"));

      await userEvent.type(
        within(currentTab).getByLabelText("Script"),
        validInput
      );

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save Form Scripts" })
      );

      expect(await getToastMessage()).toBe("Form Scripts Saved Successfully");

      await closeAllToasts();
    });

    it("should display updated value", async () => {
      render(
        <TestProviders>
          <EntityFormExtensionSettings />
        </TestProviders>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      expect(within(currentTab).getByLabelText("Script")).toHaveValue(
        `${valid}`
      );
    });

    it("should not update when invalid JS is provided", async () => {
      render(
        <TestProviders>
          <EntityFormExtensionSettings />
        </TestProviders>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      await userEvent.type(
        within(currentTab).getByLabelText("Script"),
        "Updated"
      );

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save Form Scripts" })
      );

      expect(await getToastMessage()).toBe(
        "Expression: •JS-Error: SyntaxError: Unexpected identifier"
      );

      await closeAllToasts();
    });

    it("should display previous section value", async () => {
      render(
        <TestProviders>
          <EntityFormExtensionSettings />
        </TestProviders>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      expect(within(currentTab).getByLabelText("Script")).toHaveValue(
        `${valid}`
      );
    });

    it("should be able to be cleared", async () => {
      render(
        <TestProviders>
          <EntityFormExtensionSettings />
        </TestProviders>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      await userEvent.clear(within(currentTab).getByLabelText("Script"));

      await userEvent.click(
        within(currentTab).getByRole("button", { name: "Save Form Scripts" })
      );

      expect(await getToastMessage()).toBe("Form Scripts Saved Successfully");
    });

    it("should display cleared value correctly", async () => {
      render(
        <TestProviders>
          <EntityFormExtensionSettings />
        </TestProviders>
      );

      await userEvent.click(await screen.findByRole("tab", { name: label }));

      const currentTab = screen.getByRole("tabpanel", { name: label });

      expect(within(currentTab).getByLabelText("Script")).toHaveValue(``);
    });
  });
});
