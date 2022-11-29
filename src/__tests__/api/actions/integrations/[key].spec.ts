import handler from "pages/api/actions/integrations/[key]";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

describe("/api/actions/integrations/[key]", () => {
  it("should show the integration implementation for http", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "http",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "configurationSchema": {
            "headers": {
              "type": "json",
              "validations": [],
            },
            "url": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "GET",
          "label": "GET",
        },
        {
          "configurationSchema": {
            "body": {
              "type": "json",
              "validations": [],
            },
            "headers": {
              "type": "json",
              "validations": [],
            },
            "url": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "PUT",
          "label": "PUT",
        },
        {
          "configurationSchema": {
            "body": {
              "type": "json",
              "validations": [],
            },
            "headers": {
              "type": "json",
              "validations": [],
            },
            "url": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "POST",
          "label": "POST",
        },
        {
          "configurationSchema": {
            "body": {
              "type": "json",
              "validations": [],
            },
            "headers": {
              "type": "json",
              "validations": [],
            },
            "url": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "PATCH",
          "label": "PATCH",
        },
        {
          "configurationSchema": {
            "body": {
              "type": "json",
              "validations": [],
            },
            "headers": {
              "type": "json",
              "validations": [],
            },
            "url": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "DELETE",
          "label": "DELETE",
        },
      ]
    `);
  });

  it("should show an integration implementation for other keys", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
      query: {
        key: "smtp",
      },
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "configurationSchema": {
            "body": {
              "type": "textarea",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "overrideSenderAddress": {
              "type": "text",
              "validations": [],
            },
            "overrideSenderName": {
              "type": "text",
              "validations": [],
            },
            "subject": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "to": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "SEND_MESSAGE",
          "label": "Send Message",
        },
      ]
    `);
  });
});
