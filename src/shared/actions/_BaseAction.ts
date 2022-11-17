/* eslint-disable max-classes-per-file */
interface IPerformsImplementation {
  label: string;
  configurationSchema: Record<string, string>;
  do: () => Promise<any>;
}

interface IActionIntegrationsImplemention {
  title: string;
  description: string;
  configurationSchema: Record<string, string>;
  performsImplementation: Record<string, IPerformsImplementation>;
}

const HTTP_INTEGRATION: IActionIntegrationsImplemention = {
  title: "HTTP",
  description: "Performs XXX",
  configurationSchema: {},
  performsImplementation: {
    PUT: { label: "PUT", configurationSchema: {}, do: async () => {} },
    GET: { label: "GET", configurationSchema: {}, do: async () => {} },
    POST: { label: "POST", configurationSchema: {}, do: async () => {} },
  },
};

export const ACTION_INTEGRATIONS: Record<
  string,
  IActionIntegrationsImplemention
> = {
  HTTP: HTTP_INTEGRATION,
};

// export class SMTPActionIntegration {}

// export class SlackActionIntegration {}

// export class TwilioActionIntegration {}

// export class StripeActionIntegration {}

// export class JiraActionIntegration {}

// export class ZapierActionIntegration {}
