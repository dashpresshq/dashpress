import { render, screen } from "@testing-library/react";

import ActionsIntegrations from "pages/integrations/actions/[key]";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";

setupApiHandlers();

describe("pages/integrations/actions/[key]", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");

  beforeAll(() => {
    useRouter.mockImplementation(
      USE_ROUTER_PARAMS({
        query: {
          key: "slack",
        },
      })
    );
  });

  describe("list", () => {
    it("should show the list of actions", async () => {
      render(
        <TestProviders>
          <ActionsIntegrations />
        </TestProviders>
      );

      expect(
        await screen.findByRole("link", { name: "Slack" })
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "HTTP" })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Non Activated Actions" })
      ).toBeInTheDocument();
    });
  });
});
