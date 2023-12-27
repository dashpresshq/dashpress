import React from "react";
import { render, screen } from "@testing-library/react";
import { ApplicationRoot } from "frontend/components/ApplicationRoot";
import EntityTable from "pages/admin/[entity]/index";

import { setupApiHandlers } from "__tests__/_/setupApihandlers";
import { getTableRows } from "__tests__/_/utiis/getTableRows";

setupApiHandlers();

describe("pages/admin/[entity]/index", () => {
  beforeAll(() => {
    const useRouter = jest.spyOn(require("next/router"), "useRouter");
    useRouter.mockImplementation(() => ({
      asPath: "/",
      query: {
        entity: "entity-1",
      },
      isReady: true,
    }));
  });

  it("should show data", async () => {
    render(
      <ApplicationRoot>
        <EntityTable />
      </ApplicationRoot>
    );

    expect(await screen.findByRole("table")).toBeInTheDocument();

    expect(await getTableRows(screen.getByRole("table")))
      .toMatchInlineSnapshot(`
      [
        "Entity 1 Id FieldEntity 1 Reference FieldEntity 1 String FieldEntity 1 Number FieldEntity 1 Boolean FieldEntity 1 Date FieldEntity 1 Enum FieldActions",
        "187‌hello > p-1,t=15,o=d < 347th May 2022foo",
        "188‌there > p-1,t=15,o=d < 217th May 2021foo",
        "189‌today > p-1,t=15,o=d < 187th Feb 2022bar",
      ]
    `);
  });
});
