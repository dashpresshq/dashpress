import handler from "pages/api/integrations/storage/[key]/index";
import activeHandler from "pages/api/integrations/storage/active";
import credentialsHandler from "pages/api/integrations/storage/[key]/credentials";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import { setupActivatedStorageTestData } from "__tests__/api/_test-utils/_activated-storage";

describe("/api/integrations/actions/[key]/index", () => {
  beforeAll(async () => {
    await setupAllTestData(["users"]);
    await setupActivatedStorageTestData([{ key: "google" }, { key: "minio" }]);
  });

  describe("POST", () => {
    describe("with invalid input", () => {
      it("should throw error on request", async () => {
        const { req, res } = createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "s3",
          },
          body: {
            region: "some invalid region",
          },
        });
        await handler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getJSONData()).toMatchInlineSnapshot(`
          {
            "message": "Invalid Request",
            "method": "POST",
            "name": "BadRequestError",
            "path": "",
            "statusCode": 400,
            "validations": {
              "accessKeyId": "Access Key Id is required",
              "secretAccessKey": "Secret Access Key is required",
            },
          }
        `);
      });

      it("should not show the activated storage in list", async () => {
        const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
          method: "GET",
        });

        await activeHandler(activeReq, activeRes);

        expect(activeRes._getJSONData()).toMatchInlineSnapshot(`
            [
              "google",
              "minio",
            ]
          `);
      });

      it("should not save the credentials", async () => {
        const { req: credentialsReq, res: credentialsRes } =
          createAuthenticatedMocks({
            method: "POST",
            query: {
              key: "s3",
            },
            body: {
              _password: "password",
            },
          });
        await credentialsHandler(credentialsReq, credentialsRes);

        expect(credentialsRes._getStatusCode()).toBe(400);
        expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
          {
            "message": "No credentials available for AWS_S3",
            "method": "POST",
            "name": "BadRequestError",
            "path": "",
            "statusCode": 400,
          }
        `);
      });
    });

    describe("valid", () => {
      it("should activate a storage key", async () => {
        const { req, res } = createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "s3",
          },
          body: {
            key1: "should not be saved",
            accessKeyId: "some-access-key-id",
            secretAccessKey: "some-secret-access-key",
            region: "some-region",
          },
        });
        await handler(req, res);

        expect(res._getStatusCode()).toBe(201);
      });

      it("should show the activated storage in list", async () => {
        const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
          method: "GET",
        });

        await activeHandler(activeReq, activeRes);

        expect(activeRes._getJSONData()).toMatchInlineSnapshot(`
            [
              "google",
              "minio",
              "s3",
            ]
          `);
      });

      it("should save the credentials", async () => {
        const { req: credentialsReq, res: credentialsRes } =
          createAuthenticatedMocks({
            method: "POST",
            query: {
              key: "s3",
            },
            body: {
              _password: "password",
            },
          });
        await credentialsHandler(credentialsReq, credentialsRes);

        expect(credentialsRes._getStatusCode()).toBe(201);
        expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
                  {
                    "accessKeyId": "some-access-key-id",
                    "region": "some-region",
                    "secretAccessKey": "some-secret-access-key",
                  }
              `);
      });
    });
  });

  describe("PATCH", () => {
    it("should update storage configuration", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "PATCH",
        query: {
          key: "s3",
        },
        body: {
          invalid: "should not show up",
          accessKeyId: "updated some-access-key-id",
          secretAccessKey: "updated some-secret-access-key",
          region: "updated some-region",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(200);
    });

    it("should return updated storage config", async () => {
      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "s3",
          },
          body: {
            _password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(201);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
        {
          "accessKeyId": "updated some-access-key-id",
          "region": "updated some-region",
          "secretAccessKey": "updated some-secret-access-key",
        }
      `);
    });

    it("should throw error when updating with invalid config", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        query: {
          key: "s3",
        },
        body: {
          region: "should not save",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(res._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "Invalid Request",
          "method": "POST",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
          "validations": {
            "accessKeyId": "Access Key Id is required",
            "secretAccessKey": "Secret Access Key is required",
          },
        }
      `);
    });

    it("should return previous storage config", async () => {
      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "s3",
          },
          body: {
            _password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(201);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
              {
                "accessKeyId": "updated some-access-key-id",
                "region": "updated some-region",
                "secretAccessKey": "updated some-secret-access-key",
              }
          `);
    });
  });

  describe("DELETE", () => {
    it("should deactivate activated storage", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "DELETE",
        query: {
          key: "s3",
        },
      });
      await handler(req, res);

      expect(res._getStatusCode()).toBe(204);
    });

    it("should remove activated action", async () => {
      const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
        method: "GET",
      });

      await activeHandler(activeReq, activeRes);

      expect(activeRes._getJSONData()).toMatchInlineSnapshot(`
        [
          "google",
          "minio",
        ]
      `);
    });

    it("should remove access to credentials", async () => {
      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          query: {
            key: "s3",
          },
          body: {
            _password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(400);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
        {
          "message": "No credentials available for AWS_S3",
          "method": "POST",
          "name": "BadRequestError",
          "path": "",
          "statusCode": 400,
        }
      `);
    });
  });
});
