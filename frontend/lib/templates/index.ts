import Mustache from 'mustache';

export class TemplateService {
  static compile(input: string, data: Record<string, unknown>) {
    try {
      return Mustache.render(input, data);
    } catch (error) {
      return input;
    }
  }
}
