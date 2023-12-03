import { z } from "zod";

export interface IUserPreferencesBag {
  defaultValue: unknown;
  label: string;
  validation?: z.ZodType;
}
