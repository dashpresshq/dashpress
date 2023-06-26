import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import { render, screen } from "@testing-library/react";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";

import { AppLayout } from "..";

setupApiHandlers();

describe("AppLayout", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      replace: jest.fn(),
    }));
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

      expect(screen.queryByText("Star us on Github")).not.toBeInTheDocument();
    });

    it("should show demo elements when NEXT_PUBLIC_IS_DEMO is true", async () => {
      process.env.NEXT_PUBLIC_IS_DEMO = "true";
      render(
        <ApplicationRoot>
          <AppLayout>Foo</AppLayout>
        </ApplicationRoot>
      );

      expect(
        await screen.findByRole("button", { name: "Star us on Github" })
      ).toBeInTheDocument();
    });
  });
});
