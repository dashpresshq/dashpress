import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import EntityDetails from "pages/admin/[entity]/[id]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";

setupApiHandlers();

describe("pages/admin/[entity]/[id]/index", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
        id: "2",
      },
    }));
  });

  it("should show details", async () => {
    render(
      <ApplicationRoot>
        <EntityDetails />
      </ApplicationRoot>
    );

    expect(await screen.findByLabelText("Details Section")).toHaveTextContent(
      "Entity 1 Id Field12Entity 1 Reference Field‌Entity 1 String FieldhelloEntity 1 Number Field34Entity 1 Boolean FieldEntity 1 Date Field7th May 2022Entity 1 Enum Fieldfoo"
    );
  });
});
