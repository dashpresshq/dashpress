import { render, screen, waitFor } from "@testing-library/react";

import VersionInfo from "@/pages/admin/settings/versions";
import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";
import { setupApiHandlers } from "@/tests/setupApihandlers";

setupApiHandlers();

describe("pages/admin/settings/version", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");

    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("should display system info", async () => {
    render(
      <TestProviders>
        <VersionInfo />
      </TestProviders>
    );
    await waitFor(() => {
      expect(screen.getByText("key1")).toBeInTheDocument();
    });
    expect(screen.getByText("key2")).toBeInTheDocument();
    expect(screen.getByText("key3")).toBeInTheDocument();

    expect(screen.getByText("value1")).toBeInTheDocument();
    expect(screen.getByText("value2")).toBeInTheDocument();
    expect(screen.getByText("value3")).toBeInTheDocument();
  });
});
