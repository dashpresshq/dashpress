/* eslint-disable testing-library/no-node-access */
import "@testing-library/jest-dom";
import React, { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import userEvent from "@testing-library/user-event";

import ManageDashboard from "pages/dashboard/manage";
import Dashboard from "pages";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(() => ({
  asPath: "/",
  query: {},
}));

jest.mock("react-easy-sort", () => ({
  __esModule: true,
  default: ({
    onSortEnd,
    children,
    ...props
  }: {
    onSortEnd: (newValue: number, oldValue: number) => void;
    children: ReactNode;
  }) => (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={() => {
        onSortEnd(1, 0);
      }}
      data-testid="fake-sorting"
      {...props}
    >
      {children}
    </div>
  ),
  SortableItem: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("pages/admin/settings/dashboard", () => {
  describe("Sorting", () => {
    it("should order widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widgets = await screen.findByLabelText("Dashboard Widgets");
      const order = ["Foo Table Widget", "Bar Card Widget"];
      Array.from((widgets.firstChild as HTMLElement).children).forEach(
        async (element, index) => {
          expect(element).toHaveAccessibleName(order[index]);
        }
      );
    });

    it("should change the order of the widgets", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      await screen.findByLabelText("Foo Table Widget");

      await userEvent.click(screen.getByTestId("fake-sorting"));

      expect((await screen.findAllByRole("status"))[0]).toHaveTextContent(
        "Widget Order Saved Successfully"
      );
    });

    it("should show the new ordered widget", async () => {
      render(
        <AppWrapper>
          <ManageDashboard />
        </AppWrapper>
      );

      const widgets = await screen.findByLabelText("Dashboard Widgets");
      const order = ["Bar Card Widget", "Foo Table Widget"];
      Array.from((widgets.firstChild as HTMLElement).children).forEach(
        async (element, index) => {
          expect(element).toHaveAccessibleName(order[index]);
        }
      );
    });

    it("should not be orderable in the admin page", async () => {
      render(
        <AppWrapper>
          <Dashboard />
        </AppWrapper>
      );

      await screen.findByLabelText("Foo Table Widget");

      expect(screen.queryByTestId("fake-sorting")).not.toBeInTheDocument();
    });
  });
});
