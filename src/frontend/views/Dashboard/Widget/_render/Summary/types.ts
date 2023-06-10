import { z } from "zod";

export const SummaryCardWidgetSchema = z.union([
  z.array(
    z.union([
      z.object({
        count: z.coerce.number(),
      }),
      z.coerce.number(),
    ])
  ),
  z.coerce.number(),
]);
export type ISummaryCardWidgetData = z.infer<typeof SummaryCardWidgetSchema>;
