import { AppWrapper } from "@hadmean/chromista";
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
  describe("NEXT_PUBLIC_IS_DEMO", () => {
    it("should hide demo elements when NEXT_PUBLIC_IS_DEMO is false", async () => {
      render(
        <AppWrapper>
          <AppLayout>Foo</AppLayout>
        </AppWrapper>
      );

      expect(screen.queryByText("Give Us A Star")).not.toBeInTheDocument();
    });

    it("should show demo elements when NEXT_PUBLIC_IS_DEMO is true", async () => {
      process.env.NEXT_PUBLIC_IS_DEMO = "true";
      render(
        <AppWrapper>
          <AppLayout>Foo</AppLayout>
        </AppWrapper>
      );

      expect(
        await screen.findByRole("button", { name: "Give Us A Star" })
      ).toBeInTheDocument();
    });
  });
});
