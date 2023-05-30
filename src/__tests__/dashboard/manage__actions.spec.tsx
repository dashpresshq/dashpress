import "@testing-library/jest-dom";
import React from "react";
import { render, screen, within } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/dashboard/manage";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(() => ({
  asPath: "/",
  query: {},
}));

jest.mock("nanoid", () => ({
  nanoid: jest.fn().mockReturnValueOnce("new_id_1").mockReturnValueOnce("2"),
}));

describe("pages/admin/settings/dashboard", () => {
  describe("Action Button", () => {
    it("should be able to go to home page on 'Done'", async () => {
      const replaceMock = jest.fn();
      useRouter.mockImplementation(() => ({
        replace: replaceMock,
        query: {},
      }));

      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await userEvent.click(screen.getByRole("button", { name: "Done" }));

      expect(replaceMock).toHaveBeenCalledWith("/");
    });

    it("should be able to go to new widget page", async () => {
      const pushMock = jest.fn();
      useRouter.mockImplementation(() => ({
        push: pushMock,
        query: {},
      }));

      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Add New Dashboard Widget" })
      );

      expect(pushMock).toHaveBeenCalledWith(
        "/dashboard/__home__widgets/widget/create"
      );
    });

    it("should delete table widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("Foo Table Widget");

      await userEvent.click(
        within(widget).queryByRole("button", { name: "Delete Button" })
      );

      const confirmBox = await screen.findByRole("alertdialog", {
        name: "Confirm Delete",
      });

      await userEvent.click(
        await within(confirmBox).findByRole("button", { name: "Confirm" })
      );

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Widget Deleted Successfully"
      );

      expect(
        screen.queryByLabelText("Foo Table Widget")
      ).not.toBeInTheDocument();
    });

    it("should edit summary widget", async () => {
      const pushMock = jest.fn();
      useRouter.mockImplementation(() => ({
        push: pushMock,
        query: {},
      }));

      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widget = await screen.findByLabelText("Bar Card Widget");

      await userEvent.click(
        within(widget).queryByRole("button", { name: "Edit Widget" })
      );

      expect(pushMock).toHaveBeenCalledWith(
        "/dashboard/__home__widgets/widget/summary_card_id_1"
      );
    });
  });
});
