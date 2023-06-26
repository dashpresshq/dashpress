import "@testing-library/jest-dom";
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import EntityUpdate from "pages/admin/[entity]/[id]/update";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/update", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
    }));
  });

  it("should update data", async () => {
    render(
      <ApplicationRoot>
        <EntityUpdate />
      </ApplicationRoot>
    );
    await waitFor(() => {
      expect(screen.getByText("Edit Singular entity-1")).toBeInTheDocument();
    });
  });
});

// Update
// should submit values
// Should show initial values
// Should not reset after submit
// admin user will only see security message
// Action menu create & types
// hidden create columns are hidden
// only user can access entity can view the page
// ?backlink

// State machine
// should error when entity is hidden
// Should error when entity is crud setting is hidden
//
