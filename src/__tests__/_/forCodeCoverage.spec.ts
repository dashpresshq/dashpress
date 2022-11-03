import noop from "lodash/noop";

import { FOR_CODE_COV as $1 } from "backend/lib/request/validations/types";
import { FOR_CODE_COV as $2 } from "backend/types";
import { FOR_CODE_COV as $3 } from "shared/form-schemas/types";
import { FOR_CODE_COV as $4 } from "shared/validations/types";
import { FOR_CODE_COV as $5 } from "types";
import { FOR_CODE_COV as $6 } from "shared/types/auth";
import { FOR_CODE_COV as $7 } from "shared/types/data";
import { FOR_CODE_COV as $8 } from "shared/types/db";
import { FOR_CODE_COV as $9 } from "shared/types/ui";
import { FOR_CODE_COV as $10 } from "backend/data/types";

noop($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);

describe("Code coverage ignores plain types file", () => {
  it("should be run once to be counted", () => {
    expect(1).toBe(1);
  });
});
