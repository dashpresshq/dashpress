import { rest } from "msw";
import { BASE_TEST_URL } from "./_utils";

const FORM_ACTIONS = [
  {
    id: "1",
    integration: "http",
    entity: "test-entity-1",
    trigger: "create",
    action: "POST",
    configuration: {
      url: "http://localhost:3000",
      method: "GET",
    },
  },
  {
    id: "2",
    integration: "smtp",
    entity: "test-entity-1",
    trigger: "update",
    action: "SEND_MAIL",
    configuration: {
      from: "from@gmail.com",
      to: "to@gmail.com",
    },
  },
  {
    id: "3",
    integration: "slack",
    entity: "test-entity-1",
    trigger: "delete",
    action: "SEND_MESSAGE",
    configuration: {
      url: "http://localhost:3000",
      method: "GET",
    },
  },
];

export const formActionsApiHandlers = [
  rest.get(BASE_TEST_URL("/api/form-actions/:entity"), async (_, res, ctx) => {
    return res(ctx.json(FORM_ACTIONS));
  }),
  rest.post(BASE_TEST_URL("/api/form-actions"), async (req, res, ctx) => {
    const newFormAction = await req.json();
    FORM_ACTIONS.push({ id: "id", ...newFormAction });
    if (
      JSON.stringify(newFormAction) ===
      '{"configuration":{"channel":"{ CONSTANTS.SLACK_CHANNEL }}","message":"Hello how are you","shouldNotify":true},"entity":"test-entity","trigger":"create","integration":"slack","action":"SEND_MESSAGE"}'
    ) {
      return res(ctx.status(204));
    }
    return res(ctx.status(400));
  }),
  rest.patch(
    BASE_TEST_URL("/api/form-actions/:formActionId"),
    async (req, res, ctx) => {
      const formActionId = req.params.formActionId as string;
      const formAction = await req.json();

      const index = FORM_ACTIONS.findIndex(({ id }) => id === formActionId);

      FORM_ACTIONS[index] = formAction;

      return res(ctx.status(204));
    }
  ),
  rest.delete(
    BASE_TEST_URL("/api/form-actions/:formActionId"),
    async (req, res, ctx) => {
      const formActionId = req.params.formActionId as string;

      FORM_ACTIONS.splice(
        FORM_ACTIONS.findIndex(({ id }) => id === formActionId),
        1
      );

      return res(ctx.status(204));
    }
  ),
];
