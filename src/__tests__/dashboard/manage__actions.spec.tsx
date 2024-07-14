import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "@/pages/dashboard/manage";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

import { confirmDelete, getToastMessage } from "../_/utils";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

jest.mock("nanoid", () => ({
  nanoid: jest.fn().mockReturnValueOnce("new_id_1").mockReturnValueOnce("2"),
}));

describe("pages/admin/settings/dashboard", () => {
  describe("Action Button", () => {
    it("should be able to go to home page on 'Done'", async () => {
      useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

      render(
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
      );

      expect(await screen.findByRole("link", { name: "Done" })).toHaveAttribute(
        "href",
        "/"
      );
    });

    it("should be able to go to new widget page", async () => {
      useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

      render(
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
      );

      expect(
        await screen.findByRole("link", { name: "Add New Dashboard Widget" })
      ).toHaveAttribute("href", "/dashboard/__home__widgets/widget/create");
    });

    it("should delete table widget", async () => {
      render(
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
      );

      const widget = await screen.findByLabelText("Foo Table Widget");

      await userEvent.click(
        within(widget).getByRole("button", { name: "Delete Dashboard Widget" })
      );

      await confirmDelete();

      expect(await getToastMessage()).toBe(
        "Dashboard Widget Deleted Successfully"
      );

      expect(
        screen.queryByLabelText("Foo Table Widget")
      ).not.toBeInTheDocument();
    });

    it("should edit summary widget", async () => {
      useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

      render(
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
      );

      const widget = await screen.findByLabelText("Bar Card Widget");

      expect(
        within(widget).queryByRole("link", { name: "Edit Dashboard Widget" })
      ).toHaveAttribute(
        "href",
        "/dashboard/__home__widgets/widget/summary_card_id_1"
      );
    });
  });
});
