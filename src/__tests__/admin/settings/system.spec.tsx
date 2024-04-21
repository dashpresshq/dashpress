import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import userEvent from "@testing-library/user-event";
import SystemSettings from "pages/admin/settings/system";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/system", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      isReady: true,
    }));
  });

  it("should display system values", async () => {
    render(
      <ApplicationRoot>
        <SystemSettings />
      </ApplicationRoot>
    );
    await waitFor(async () => {
      expect(
        await screen.findByLabelText("Token Validity Duration In Days")
      ).toHaveValue(5);
    });
  });

  it("should update system settings successfully", async () => {
    render(
      <ApplicationRoot>
        <SystemSettings />
      </ApplicationRoot>
    );

    await userEvent.type(
      screen.getByLabelText("Token Validity Duration In Days"),
      "9"
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save System Settings" })
    );

    expect(await screen.findByRole("status")).toHaveTextContent(
      "System Settings Saved Successfully"
    );
  });

  it("should display updated system values", async () => {
    render(
      <ApplicationRoot>
        <SystemSettings />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(
        screen.getByLabelText("Token Validity Duration In Days")
      ).toHaveValue(59);
    });
  });
});
