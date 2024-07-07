import { rest } from "msw";

import { BASE_TEST_URL } from "./_utils";

export const integrationsListApiHandlers = [
  rest.get(
    BASE_TEST_URL("/api/integrations/actions/list"),
    async (_, res, ctx) => {
      return res(
        ctx.json([
          {
            key: "http",
            title: "HTTP",
            description: "Some HTTP Description",
            configurationSchema: {},
          },
          {
            key: "slack",
            title: "Slack",
            description: "Some Slack Description",
            configurationSchema: {
              token: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
            },
          },
          {
            key: "non-activated-actions",
            title: "Non Activated Actions",
            description: "Some Non Activated Actions Description",
            configurationSchema: {
              username: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              password: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
            },
          },
          {
            key: "smtp",
            title: "SMTP",
            description: "Some SMTP Description",
            configurationSchema: {
              host: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              port: {
                type: "number",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              secure: {
                type: "boolean",
                validations: [],
              },
            },
          },
        ])
      );
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/integrations/actions/active"),
    async (_, res, ctx) => {
      return res(ctx.json(["http", "slack", "smtp"]));
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/integrations/actions/:integration/implementations"),
    async (req, res, ctx) => {
      const requestedIntegration = req.params.integration as string;
      return res(
        ctx.json([
          {
            key: "SEND_MESSAGE",
            label: `Send Message - ${requestedIntegration}`,
            configurationSchema: {
              channel: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              message: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              shouldNotify: {
                type: "boolean",
                validations: [],
              },
            },
          },
          {
            key: "SEND_MAIL",
            label: `Send Mail - ${requestedIntegration}`,
            configurationSchema: {
              from: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
              to: {
                type: "text",
                validations: [
                  {
                    validationType: "required",
                  },
                ],
              },
            },
          },
        ])
      );
    }
  ),
];
