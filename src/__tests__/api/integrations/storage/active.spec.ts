import activeHandler from "pages/api/integrations/storage/active";
import credentialsHandler from "pages/api/integrations/storage/credentials";
import {
  createAuthenticatedMocks,
  setupAllTestData,
} from "__tests__/api/_test-utils";
import { createKeyValueDomainPersistenceService } from "backend/lib/key-value";

describe("/api/integrations/actions/[key]/index", () => {
  beforeAll(async () => {
    const currentStorageKeyValueStoreApiService =
      createKeyValueDomainPersistenceService<string>("current-storage");

    currentStorageKeyValueStoreApiService.clearItem();

    await setupAllTestData(["users", "credentials"]);
  });

  describe("CREATE", () => {
    describe("with invalid input", () => {
      it("should throw error on request", async () => {
        const { req, res } = createAuthenticatedMocks({
          method: "POST",
          body: {
            storageKey: "s3",
            configuration: {
              region: "some invalid region",
            },
          },
        });
        await activeHandler(req, res);

        expect(res._getStatusCode()).toBe(400);
        expect(res._getJSONData()).toMatchInlineSnapshot(`
          {
            "message": "Invalid Request",
            "method": "POST",
            "name": "BadRequestError",
            "path": "",
            "statusCode": 400,
            "validations": {
              "accessKeyId": "Access Key ID is required",
              "secretAccessKey": "Secret Access Key is required",
            },
          }
        `);
      });

      it("should not save the credentials", async () => {
        const { req: credentialsReq, res: credentialsRes } =
          createAuthenticatedMocks({
            method: "POST",
            body: {
              _password: "password",
            },
          });
        await credentialsHandler(credentialsReq, credentialsRes);

        expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`{}`);
      });
    });

    describe("valid", () => {
      it("should activate a storage key", async () => {
        const { req, res } = createAuthenticatedMocks({
          method: "POST",
          body: {
            storageKey: "s3",
            configuration: {
              key1: "should not be saved",
              accessKeyId: "some-access-key-id",
              secretAccessKey: "some-secret-access-key",
              region: "some-region",
            },
          },
        });
        await activeHandler(req, res);

        expect(res._getStatusCode()).toBe(201);
      });

      it("should show the activated storage", async () => {
        const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
          method: "GET",
        });

        await activeHandler(activeReq, activeRes);

        expect(activeRes._getJSONData()).toMatchInlineSnapshot(`
            {
              "data": "s3",
            }
          `);
      });

      it("should save the credentials", async () => {
        const { req: credentialsReq, res: credentialsRes } =
          createAuthenticatedMocks({
            method: "POST",
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

  describe("UPDATE", () => {
    it("should update storage configuration", async () => {
      const { req, res } = createAuthenticatedMocks({
        method: "POST",
        body: {
          storageKey: "cloudinary",
          configuration: {
            invalid: "should not show up",
            apiKey: "updated some-api-key",
            apiSecret: "updated some-api-secret",
            cloudName: "updated some-cloud-name",
          },
        },
      });
      await activeHandler(req, res);

      expect(res._getStatusCode()).toBe(201);
    });

    it("should show the activated storage", async () => {
      const { req: activeReq, res: activeRes } = createAuthenticatedMocks({
        method: "GET",
      });

      await activeHandler(activeReq, activeRes);

      expect(activeRes._getJSONData()).toMatchInlineSnapshot(`
          {
            "data": "cloudinary",
          }
        `);
    });

    it("should return updated storage config", async () => {
      const { req: credentialsReq, res: credentialsRes } =
        createAuthenticatedMocks({
          method: "POST",
          body: {
            _password: "password",
          },
        });
      await credentialsHandler(credentialsReq, credentialsRes);

      expect(credentialsRes._getStatusCode()).toBe(201);
      expect(credentialsRes._getJSONData()).toMatchInlineSnapshot(`
        {
          "apiKey": "updated some-api-key",
          "apiSecret": "updated some-api-secret",
          "cloudName": "updated some-cloud-name",
        }
      `);
    });
  });
});
