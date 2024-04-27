import handler from "pages/api/integrations/actions/[key]/implementations";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

describe("/api/integrations/actions/[key]/implementations", () => {
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
              "label": {
                "id": "ZIgY2y",
                "message": "Headers",
              },
              "type": "json",
              "validations": [],
            },
            "url": {
              "label": {
                "id": "IagCbF",
                "message": "URL",
              },
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
              "label": {
                "id": "bGQplw",
                "message": "Body",
              },
              "type": "json",
              "validations": [],
            },
            "headers": {
              "label": {
                "id": "ZIgY2y",
                "message": "Headers",
              },
              "type": "json",
              "validations": [],
            },
            "url": {
              "label": {
                "id": "IagCbF",
                "message": "URL",
              },
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
              "label": {
                "id": "bGQplw",
                "message": "Body",
              },
              "type": "json",
              "validations": [],
            },
            "headers": {
              "label": {
                "id": "ZIgY2y",
                "message": "Headers",
              },
              "type": "json",
              "validations": [],
            },
            "url": {
              "label": {
                "id": "IagCbF",
                "message": "URL",
              },
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
              "label": {
                "id": "bGQplw",
                "message": "Body",
              },
              "type": "json",
              "validations": [],
            },
            "headers": {
              "label": {
                "id": "ZIgY2y",
                "message": "Headers",
              },
              "type": "json",
              "validations": [],
            },
            "url": {
              "label": {
                "id": "IagCbF",
                "message": "URL",
              },
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
              "label": {
                "id": "bGQplw",
                "message": "Body",
              },
              "type": "json",
              "validations": [],
            },
            "headers": {
              "label": {
                "id": "ZIgY2y",
                "message": "Headers",
              },
              "type": "json",
              "validations": [],
            },
            "url": {
              "label": {
                "id": "IagCbF",
                "message": "URL",
              },
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
              "label": {
                "id": "bGQplw",
                "message": "Body",
              },
              "type": "richtext",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "senderEmail": {
              "label": {
                "id": "oWvSIB",
                "message": "Sender Email",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "senderName": {
              "label": {
                "id": "fXHEMx",
                "message": "Sender Name",
              },
              "type": "text",
              "validations": [],
            },
            "subject": {
              "label": {
                "id": "UJmAAK",
                "message": "Subject",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "to": {
              "label": {
                "id": "/jQctM",
                "message": "To",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "SEND_MAIL",
          "label": "Send Mail",
        },
      ]
    `);
  });
});
