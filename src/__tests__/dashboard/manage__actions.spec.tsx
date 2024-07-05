import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/dashboard/manage";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { getToastMessage } from "../_/utils/closeAllToasts";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

jest.mock("nanoid", () => ({
  nanoid: jest.fn().mockReturnValueOnce("new_id_1").mockReturnValueOnce("2"),
}));

describe("pages/admin/settings/dashboard", () => {
  describe("Action Button", () => {
    it("should be able to go to home page on 'Done'", async () => {
      const replaceMock = jest.fn();
      useRouter.mockImplementation(USE_ROUTER_PARAMS({ replaceMock }));

      render(
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
      );

      await userEvent.click(
        await screen.findByRole("button", { name: "Done" })
      );

      expect(replaceMock).toHaveBeenCalledWith("/");
    });

    it("should be able to go to new widget page", async () => {
      const pushMock = jest.fn();
      useRouter.mockImplementation(USE_ROUTER_PARAMS({ pushMock }));

      render(
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
      );

      await userEvent.click(
        await screen.findByRole("button", { name: "Add New Dashboard Widget" })
      );

      expect(pushMock).toHaveBeenCalledWith(
        "/dashboard/__home__widgets/widget/create"
      );
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

      const confirmBox = await screen.findByRole("alertdialog", {
        name: "Confirm Delete",
      });

      await userEvent.click(
        await within(confirmBox).findByRole("button", { name: "Confirm" })
      );

      expect(await getToastMessage()).toBe("Widget Deleted Successfully");

      expect(
        screen.queryByLabelText("Foo Table Widget")
      ).not.toBeInTheDocument();
    });

    it("should edit summary widget", async () => {
      const pushMock = jest.fn();
      useRouter.mockImplementation(USE_ROUTER_PARAMS({ pushMock }));

      render(
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
      );

      const widget = await screen.findByLabelText("Bar Card Widget");

      await userEvent.click(
        within(widget).queryByRole("button", { name: "Edit Dashboard Widget" })
      );

      expect(pushMock).toHaveBeenCalledWith(
        "/dashboard/__home__widgets/widget/summary_card_id_1"
      );
    });
  });
});
