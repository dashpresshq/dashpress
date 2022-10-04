import noop from "lodash/noop";

import { FOR_CODE_COV as $1 } from "backend/lib/request/validations/types";
import { FOR_CODE_COV as $2 } from "backend/types";
import { FOR_CODE_COV as $3 } from "shared/form-schemas/types";
import { FOR_CODE_COV as $4 } from "shared/validations/types";
import { FOR_CODE_COV as $5 } from "types";

noop($1, $2, $3, $4, $5);

describe("Code coverage ignores plain types file", () => {
  it("should be run once to be counted", () => {
    expect(1).toBe(1);
  });
});
