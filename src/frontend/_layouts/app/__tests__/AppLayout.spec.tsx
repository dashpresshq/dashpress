import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { render, screen, waitFor } from "@testing-library/react";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";

import { AuthActions } from "frontend/hooks/auth/auth.actions";
import userEvent from "@testing-library/user-event";
import { AppLayout } from "..";

setupApiHandlers();

Object.defineProperty(window, "location", {
  value: {
    ...window.location,
    replace: jest.fn(),
  },
  writable: true,
});

describe("AppLayout", () => {
  const replaceMock = jest.fn();
  const pushMock = jest.fn();

  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(() => ({
      replace: replaceMock,
      push: pushMock,
      asPath: "/",
      isReady: true,
    }));
  });

  it("should render the content", async () => {
    render(
      <ApplicationRoot>
        <AppLayout>Foo Content</AppLayout>
      </ApplicationRoot>
    );

    expect(screen.getByText("Foo Content")).toBeInTheDocument();
  });

  describe("demo", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });

    afterEach(() => {
      process.env = OLD_ENV;
    });

    it("should hide demo elements when NEXT_PUBLIC_IS_DEMO is false", async () => {
      render(
        <ApplicationRoot>
          <AppLayout>Foo</AppLayout>
        </ApplicationRoot>
      );

      expect(
        screen.queryByRole("button", { name: "Star us on Github" })
      ).not.toBeInTheDocument();
    });

    it("should show demo elements when NEXT_PUBLIC_IS_DEMO is true", async () => {
      jest.spyOn(window, "open");

      process.env.NEXT_PUBLIC_IS_DEMO = "true";
      render(
        <ApplicationRoot>
          <AppLayout>Foo</AppLayout>
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByRole("button", { name: "Star us on Github" })
      );

      expect(window.open).toHaveBeenCalledWith(
        "https://github.com/dashpresshq/dashpress"
      );
    });
  });

  describe("Sidebar menu", () => {
    it("should toggle the sidebar and toggle the correct elements", async () => {
      render(
        <ApplicationRoot>
          <AppLayout>Foo</AppLayout>
        </ApplicationRoot>
      );

      expect(await screen.findByAltText("full logo")).toBeInTheDocument();
      expect(screen.queryByAltText("small logo")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Toggle Profile Menu")).toBeInTheDocument();
      expect(await screen.findByText("Hi, Root User")).toBeInTheDocument();
      expect(
        await screen.findByRole("link", { name: "Menu Item 1" })
      ).toBeInTheDocument();

      await userEvent.click(
        screen.getByRole("button", { name: "Toggle Side Bar" })
      );

      expect(screen.getByAltText("small logo")).toBeInTheDocument();
      expect(screen.queryByAltText("full logo")).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText("Toggle Profile Menu")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Hi, Root User")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Menu Item 1" })
      ).not.toBeInTheDocument();

      await userEvent.click(
        screen.getByRole("button", { name: "Toggle Side Bar" })
      );

      expect(screen.getByAltText("full logo")).toBeInTheDocument();
      expect(screen.queryByAltText("small logo")).not.toBeInTheDocument();
      expect(screen.getByLabelText("Toggle Profile Menu")).toBeInTheDocument();
      expect(screen.getByText("Hi, Root User")).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Menu Item 1" })
      ).toBeInTheDocument();
    });

    it("should open menu items", async () => {
      render(
        <ApplicationRoot>
          <AppLayout>Foo</AppLayout>
        </ApplicationRoot>
      );

      await userEvent.click(
        await screen.findByLabelText("Toggle Profile Menu")
      );

      await userEvent.click(
        await screen.findByRole("button", { name: "My Account" })
      );

      expect(pushMock).toHaveBeenCalledWith("/account/profile");
    });
  });

  describe("Not Signed In", () => {
    it("should redirect to sign in when not authenticated", async () => {
      localStorage.removeItem(AuthActions.JWT_TOKEN_STORAGE_KEY);

      render(
        <ApplicationRoot>
          <AppLayout>Foo</AppLayout>
        </ApplicationRoot>
      );

      await waitFor(() => {
        expect(window.location.replace).toHaveBeenCalledWith("/auth");
      });
    });
  });
});
