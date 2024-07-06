import { USE_ROUTER_PARAMS } from "__tests__/_/constants";
import { TestProviders } from "__tests__/_/Provider";
import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SiteSettings from "pages/admin/settings/site";

import { getToastMessage } from "@/__tests__/_/utils/closeAllToasts";

setupApiHandlers();

describe("pages/admin/settings/site", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("should display site values", async () => {
    render(
      <TestProviders>
        <SiteSettings />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("DashPress");
    });
    expect(screen.getByLabelText("Home Link")).toHaveValue("/");
    expect(screen.getByLabelText("Small Logo")).toHaveValue(
      "/assets/images/logo.png"
    );
    expect(screen.getByLabelText("Large Logo")).toHaveValue(
      "/assets/images/full-logo.png"
    );
  });

  it("should update site values successfully", async () => {
    render(
      <TestProviders>
        <SiteSettings />
      </TestProviders>
    );

    await userEvent.type(screen.getByLabelText("Name"), "Updated");
    await userEvent.type(screen.getByLabelText("Home Link"), "Updated");
    await userEvent.type(screen.getByLabelText("Small Logo"), "Updated");
    await userEvent.type(screen.getByLabelText("Large Logo"), "Updated");

    await userEvent.click(
      screen.getByRole("button", { name: "Save Site Settings" })
    );

    expect(await getToastMessage()).toBe("Site Settings Saved Successfully");
  });

  it("should display edited site values", async () => {
    render(
      <TestProviders>
        <SiteSettings />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toHaveValue("DashPressUpdated");
    });
    expect(screen.getByLabelText("Home Link")).toHaveValue("/Updated");
    expect(screen.getByLabelText("Small Logo")).toHaveValue(
      "/assets/images/logo.pngUpdated"
    );
    expect(screen.getByLabelText("Large Logo")).toHaveValue(
      "/assets/images/full-logo.pngUpdated"
    );
  });
});
