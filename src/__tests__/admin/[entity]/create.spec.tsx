import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { AppWrapper } from "@hadmean/chromista";
import EntityCreate from "pages/admin/[entity]/create";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/create", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
    }));
  });

  it("should create data", async () => {
    render(
      <AppWrapper>
        <EntityCreate />
      </AppWrapper>
    );
    await waitFor(() => {
      expect(screen.getByText("Create Singular entity-1")).toBeInTheDocument();
    });
  });
});

// Can create data
// Action menu create & types
// only user can access entity can view the page
// hidden create columns are hidden
// ?backlink
