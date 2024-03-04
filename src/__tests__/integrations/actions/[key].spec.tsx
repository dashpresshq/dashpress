import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";

import ActionsIntegrations from "pages/integrations/actions/[key]";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
// import userEvent from "@testing-library/user-event";
// import { closeAllToasts } from "__tests__/_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/integrations/actions/[key]", () => {
  const useRouter = jest.spyOn(require("next/router"), "useRouter");
  beforeAll(() => {
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        key: "slack",
      },
      isReady: true,
    }));
  });

  describe("list", () => {
    it("should show the list of actions", async () => {
      render(
        <ApplicationRoot>
          <ActionsIntegrations />
        </ApplicationRoot>
      );

      expect(
        await screen.findByRole("link", { name: "Slack" })
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "HTTP" })).toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Non Activated Actions" })
      ).toBeInTheDocument();
    });

    // it("should show the configure UI for activated actions", async () => {
    //   render(
    //     <ApplicationRoot>
    //       <ActionsIntegrations />
    //     </ApplicationRoot>
    //   );

    //   await waitFor(() => {
    //     expect(
    //       screen.getByRole("option", { selected: true })
    //     ).toHaveTextContent("Slack");
    //   });
    // });
  });
});
