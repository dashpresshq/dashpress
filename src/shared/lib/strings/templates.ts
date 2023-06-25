import Mustache from "mustache";

export function compileTemplateString(
  input: string,
  data: Record<string, unknown>
) {
  try {
    return Mustache.render(input, data);
  } catch (error) {
    return (error as Error).message;
  }
}
