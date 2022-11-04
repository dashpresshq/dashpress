import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
// import userEvent from "@testing-library/user-event";
import EntityViewsSettings from "pages/admin/[entity]/config/views";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/config/views", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
    }));
  });

  it("should display views settings", async () => {
    render(
      <AppWrapper>
        <EntityViewsSettings />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(
        screen.getByRole("tab", { name: "Foo Entity View" })
      ).toBeInTheDocument();
    });
    expect(
      screen.getByRole("tab", { name: "Bar Entity View" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "Baz Entity View" })
    ).toBeInTheDocument();
  });
});
