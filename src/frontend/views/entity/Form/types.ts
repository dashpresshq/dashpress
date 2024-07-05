import type { IFormExtension } from "@/components/app/form/schema/types";

export interface IEntityFormExtension extends IFormExtension {
  initialValues: string;
}
