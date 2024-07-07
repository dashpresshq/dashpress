import getHandler from "@/pages/api/form-actions/[key]";
import handler from "@/pages/api/form-actions/index";
import { createAuthenticatedMocks, setupAllTestData } from "@/tests/api/setups";

jest.mock("nanoid", () => ({
  nanoid: jest
    .fn()
    .mockReturnValueOnce("nano-id-1")
    .mockReturnValueOnce("nano-id-2"),
}));

describe("/api/form-actions/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["form-actions", "activated-integrations"]);
  });

  it("should instantiate actions", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "POST",
      body: {
        entity: "test-entity",
        integration: "smtp",
        action: "SEND_MESSAGE",
        trigger: "update",
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
        integration: "http",
        action: "PUT",
        trigger: "create",
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

  it("should show all the added form actions", async () => {
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
          "action": "SEND_MESSAGE",
          "configuration": {
            "body": "You are awesome",
            "subject": "something important",
            "to": "me",
          },
          "entity": "test-entity",
          "id": "nano-id-1",
          "integration": "smtp",
          "trigger": "update",
        },
        {
          "action": "PUT",
          "configuration": {
            "body": "{"me": "you"}",
            "headers": "{"me": "you"}",
            "url": "/some-where",
          },
          "entity": "test-entity",
          "id": "nano-id-2",
          "integration": "http",
          "trigger": "create",
        },
      ]
    `);
  });
});
