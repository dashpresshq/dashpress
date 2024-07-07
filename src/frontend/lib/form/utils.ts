import type { FormApi } from "final-form";

import { typescriptSafeObjectDotKeys } from "@/shared/lib/objects";

export function resetFormValues<T extends Record<string, unknown>>(
  resetForm: boolean,
  values: T,
  form: FormApi<T, Partial<T>>,
  initialValues: Partial<T> = {}
) {
  form.batch(() => {
    if (resetForm && values) {
      typescriptSafeObjectDotKeys(values).forEach((field: string) => {
        if (field === "id") {
          return;
        }
        form.change(field, initialValues[field]);
        form.resetFieldState(field);
      });
    }
  });
}
