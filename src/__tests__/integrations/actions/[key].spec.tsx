import { render, screen } from "@testing-library/react";

import ActionsIntegrations from "@/pages/integrations/actions/[key]";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

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
        await screen.findByRole("option", { name: "Slack" })
      ).toBeInTheDocument();
      expect(screen.getByRole("option", { name: "HTTP" })).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Non Activated Actions" })
      ).toBeInTheDocument();
    });
  });
});
