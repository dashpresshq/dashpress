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

// Base entity form
// form extensaion should work, field state and before submit with `action` example
// > Validations
// Should use custom field labels
// Should hide hidden columns
// should hide id columns
// Should use the configured `entity_columns_types`
// Should use and merge the configured `entity_validations` with `isBoundToType` and the `guessEntityValidations` with eyes on the order when they clash
// Should use `entity_selections`, for booleans text
// Should use `entity_selections`, custom `selection` type
// Should use `entity_selections`, custom `enum` type and override
// Should submit only the displayed fields when submitting

// create
// should reset after submit
// should submit values
// Action menu create & types
// hidden create columns are hidden
// only user can access entity can view the page
// ?backlink

// State machine
// should error when entity is hidden
// Should error when entity is crud setting is hidden
//
