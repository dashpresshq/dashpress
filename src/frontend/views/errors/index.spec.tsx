import { render, screen } from "@testing-library/react";

import { USE_ROUTER_PARAMS } from "@/tests/constants";
import { TestProviders } from "@/tests/Provider";

import { NotFound } from "./NotFound";
import { ServerError } from "./ServerError";
import { UnAuthorized } from "./UnAuthorized";

describe("Error pages", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(USE_ROUTER_PARAMS({}));
  });

  it("renders the 500 error page", () => {
    render(
      <TestProviders>
        <ServerError />
      </TestProviders>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("500");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Internal Server Error"
    );
  });

  it("renders the 403 error page", () => {
    render(
      <TestProviders>
        <UnAuthorized />
      </TestProviders>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("403");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Unauthorized"
    );
  });

  it("renders the 404 error page", () => {
    render(
      <TestProviders>
        <NotFound />
      </TestProviders>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("404");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Page Not Found"
    );
  });
});
