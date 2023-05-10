import { z } from "zod";

export const SummaryCardWidgetSchema = z.array(
  z.object({
    count: z.coerce.number(),
  })
);

export type ISummaryCardWidgetData = z.infer<typeof SummaryCardWidgetSchema>;
