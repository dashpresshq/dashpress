import handler from "pages/api/integrations/storage/list";
import { createAuthenticatedMocks } from "__tests__/api/_test-utils";

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
          "configurationSchema": {},
          "description": "Store uploaded files to Local Storage",
          "key": "file",
          "title": "Local Storage",
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
          "description": "Store uploaded files to AWS S3",
          "key": "s3",
          "title": "AWS S3",
        },
        {
          "configurationSchema": {},
          "description": "Store uploaded files to Firebase Storage",
          "key": "firebase",
          "title": "Firebase Storage",
        },
        {
          "configurationSchema": {},
          "description": "Store uploaded files to Minio",
          "key": "minio",
          "title": "Minio",
        },
        {
          "configurationSchema": {},
          "description": "Store uploaded files to Cloudinary",
          "key": "cloudinary",
          "title": "Cloudinary",
        },
        {
          "configurationSchema": {},
          "description": "Store uploaded files to Google Cloud Storage",
          "key": "google",
          "title": "Google Cloud Storage",
        },
      ]
    `);
  });
});
