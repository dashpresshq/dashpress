import { createAuthenticatedMocks } from "__tests__/api/_test-utils";
import handler from "pages/api/integrations/storage/list";

describe("/api/integrations/storage/list", () => {
  it("should list storage integrations", async () => {
    const { req, res } = createAuthenticatedMocks({
      method: "GET",
    });
    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toMatchInlineSnapshot(`
      [
        {
          "configurationSchema": {
            "accessKeyId": {
              "label": {
                "id": "pNW+Rt",
                "message": "Access Key ID",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "region": {
              "label": {
                "id": "uJ+Ve2",
                "message": "Region",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "secretAccessKey": {
              "label": {
                "id": "llJ0OR",
                "message": "Secret Access Key",
              },
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "s3",
          "title": "AWS S3",
        },
        {
          "configurationSchema": {
            "apiKey": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "apiSecret": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "cloudName": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "cloudinary",
          "title": "Cloudinary",
        },
        {
          "configurationSchema": {
            "accessKeyId": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "region": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
            "secretAccessKey": {
              "type": "text",
              "validations": [
                {
                  "validationType": "required",
                },
              ],
            },
          },
          "key": "google",
          "title": "Google Cloud Storage",
        },
      ]
    `);
  });
});
