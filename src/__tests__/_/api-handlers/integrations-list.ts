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
      return res(ctx.json(["http", "slack"]));
    }
  ),
  rest.get(
    BASE_TEST_URL("/api/integrations/actions/:integration/implementations"),
    async (_, res, ctx) => {
      return res(
        ctx.json([
          {
            key: "send_message",
            label: "Send Message",
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
            key: "send_mail",
            label: "Send Mail",
            configurationSchema: {
              message: {
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
