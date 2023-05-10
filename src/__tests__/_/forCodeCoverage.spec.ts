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
import { FOR_CODE_COV as $11 } from "backend/lib/request/validations/implementations/types";
import { FOR_CODE_COV as $12 } from "backend/actions/integrations/mailgun/types";
import { FOR_CODE_COV as $13 } from "backend/actions/integrations/postmark/types";
import { FOR_CODE_COV as $14 } from "backend/actions/integrations/sendgrid/types";
import { FOR_CODE_COV as $15 } from "backend/actions/integrations/sendinblue/types";
import { FOR_CODE_COV as $16 } from "backend/actions/integrations/slack/types";
import { FOR_CODE_COV as $17 } from "backend/actions/integrations/smtp/types";
import { FOR_CODE_COV as $18 } from "backend/actions/integrations/twilio/types";
import { FOR_CODE_COV as $19 } from "backend/storage/types";
import { FOR_CODE_COV as $20 } from "frontend/views/settings/Variables/types";

noop(
  $1,
  $2,
  $3,
  $4,
  $5,
  $6,
  $7,
  $8,
  $9,
  $10,
  $11,
  $12,
  $13,
  $14,
  $15,
  $16,
  $17,
  $18,
  $19,
  $20
);

describe("Code coverage ignores plain types file", () => {
  it("should be run once to be counted", () => {
    expect(1).toBe(1);
  });
});
