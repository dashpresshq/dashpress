import handler from "pages/api/integrations/actions/instances/index";
import getHandler from "pages/api/integrations/actions/instances/[key]";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";

jest.mock("nanoid", () => ({
  nanoid: jest
    .fn()
    .mockReturnValueOnce("nano-id-1")
    .mockReturnValueOnce("nano-id-2"),
}));

describe("/api/integrations/actions/instances/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["action-instances", "activated-integrations"]);
  });

  it("should instantiate actions", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        entity: "test-entity",
        integrationKey: "smtp",
        implementationKey: "SEND_MESSAGE",
        formAction: "update",
        configuration: {
          to: "me",
          subject: "something important",
          body: "You are awesome",
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  it("should instantiate HTTP action", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        entity: "test-entity",
        integrationKey: "http",
        implementationKey: "PUT",
        formAction: "create",
        configuration: {
          url: "/some-where",
          body: '{"me": "you"}',
          headers: '{"me": "you"}',
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  it("should not instantiate action for un-activated integration", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        integrationKey: "postmark",
        entity: "test-entity-2",
        implementationKey: "GET",
        formAction: "update",
        configuration: {
          bad: '{"request": "hello"}',
        },
      },
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      {
        "message": "The integration for 'postmark' has not yet been activated",
        "method": "POST",
        "name": "BadRequestError",
        "path": "",
        "statusCode": 400,
      }
    `);
  });

  it("should show all the added action instances", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "test-entity",
      },
    });
    await getHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "configuration": {
            "body": "You are awesome",
            "subject": "something important",
            "to": "me",
          },
          "entity": "test-entity",
          "formAction": "update",
          "implementationKey": "SEND_MESSAGE",
          "instanceId": "nano-id-1",
          "integrationKey": "smtp",
        },
        {
          "configuration": {
            "body": "{"me": "you"}",
            "headers": "{"me": "you"}",
            "url": "/some-where",
          },
          "entity": "test-entity",
          "formAction": "create",
          "implementationKey": "PUT",
          "instanceId": "nano-id-2",
          "integrationKey": "http",
        },
      ]
    `);
  });
});
