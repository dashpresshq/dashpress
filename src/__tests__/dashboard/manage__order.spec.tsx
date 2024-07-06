/* eslint-disable testing-library/no-node-access */
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dashboard from "pages";
import ManageDashboard from "pages/dashboard/manage";
import type { ReactNode } from "react";

setupApiHandlers();

const useRouter = jest.spyOn(require("next/router"), "useRouter");

useRouter.mockImplementation(USE_ROUTER_PARAMS({}));

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
  SortableKnob: ({ children }: { children: ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("pages/admin/settings/dashboard", () => {
  describe("Sorting", () => {
    it("should order widget", async () => {
      render(
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
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
        <TestProviders>
          <ManageDashboard />
        </TestProviders>
      );

      await screen.findByLabelText("Foo Table Widget");

      await userEvent.click(screen.getByTestId("fake-sorting"));

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
        <TestProviders>
          <Dashboard />
        </TestProviders>
      );

      await screen.findByLabelText("Foo Table Widget");

      expect(screen.queryByTestId("fake-sorting")).not.toBeInTheDocument();
    });
  });
});
