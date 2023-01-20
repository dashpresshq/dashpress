import { rest } from "msw";
import { HTTP_ACTIVATION_ID } from "shared/types/actions";
import { BASE_TEST_URL } from "./_utils";

export const actionsApiHandlers = [
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
      return res(
        ctx.json([
          {
            activationId: HTTP_ACTIVATION_ID,
            integrationKey: "http",
            credentialsGroupKey: "HTTP",
          },
          {
            activationId: "slack-activation-id",
            integrationKey: "slack",
            credentialsGroupKey: "SLACK",
          },
        ])
      );
    }
  ),
  //   rest.put(
  //     BASE_TEST_URL("/api/integrations/constants/:key"),
  //     async (req, res, ctx) => {
  //       const key = req.params.key as string;
  //       const { value } = await req.json();

  //       const index = CONSTANTS.findIndex((constant) => constant.key === key);

  //       if (index > -1) {
  //         CONSTANTS[index] = { key, value };
  //       } else {
  //         CONSTANTS.push({ key, value });
  //       }

  //       return res(ctx.status(204));
  //     }
  //   ),
  //   rest.delete(
  //     BASE_TEST_URL("/api/integrations/constants/:key"),
  //     async (req, res, ctx) => {
  //       const key = req.params.key as string;

  //       CONSTANTS = CONSTANTS.filter((permission$1) => permission$1.key !== key);
  //       return res(ctx.status(204));
  //     }
  //   ),
];
