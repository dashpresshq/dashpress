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
          "label": {
            "id": "GET",
            "message": "GET",
          },
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
          "label": {
            "id": "PUT",
            "message": "PUT",
          },
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
          "label": {
            "id": "POST",
            "message": "POST",
          },
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
          "label": {
            "id": "PATCH",
            "message": "PATCH",
          },
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
          "label": {
            "id": "DELETE",
            "message": "DELETE",
          },
        },
      ]
    `);
  });
});
