import { ConfigApiService } from "backend/lib/config/config.service";
import { AbstractConfigDataPersistenceService } from "../AbstractConfigDataPersistenceService";
import { DatabaseConfigDataPersistenceAdaptor } from "../DatabaseConfigDataPersistenceAdaptor";
import { JsonFileConfigDataPersistenceAdaptor } from "../JsonFileConfigDataPersistenceAdaptor";
import { MemoryConfigDataPersistenceAdaptor } from "../MemoryConfigDataPersistenceAdaptor";
import { RedisConfigDataPersistenceAdaptor } from "../RedisConfigDataPersistenceAdaptor";
import { ConfigDomain } from "../types";

interface ITestData {
  id: string;
  name: string;
  age: number;
}

const TEST_DOMAIN = "test" as ConfigDomain;

const PERSITENT_ADAPTORS: {
  title: string;
  adaptor: AbstractConfigDataPersistenceService<ITestData>;
}[] = [
  {
    title: "JSON File",
    adaptor: new JsonFileConfigDataPersistenceAdaptor<ITestData>(
      TEST_DOMAIN,
      new ConfigApiService({
        DO_NOT_BOOSTRAP_CONFIG: true,
      })
    ),
  },
  {
    title: "Memory",
    adaptor: new MemoryConfigDataPersistenceAdaptor<ITestData>(
      TEST_DOMAIN,
      new ConfigApiService({
        DO_NOT_BOOSTRAP_CONFIG: true,
      })
    ),
  },
  {
    title: "Database",
    adaptor: new DatabaseConfigDataPersistenceAdaptor<ITestData>(
      TEST_DOMAIN,
      new ConfigApiService({
        DO_NOT_BOOSTRAP_CONFIG: true,
        CONFIG_ADAPTOR_CONNECTION_STRING: "sqlite3:./test-adaptor.sqlite",
      })
    ),
  },
  {
    title: "Redis",
    adaptor: new RedisConfigDataPersistenceAdaptor<ITestData>(
      TEST_DOMAIN,
      new ConfigApiService({
        DO_NOT_BOOSTRAP_CONFIG: true,
        CONFIG_ADAPTOR_CONNECTION_STRING: "redis://localhost",
      })
    ),
  },
];

describe.each(PERSITENT_ADAPTORS)(
  "$title persistence adaptor",
  ({ adaptor, title }) => {
    beforeAll(async () => {
      await adaptor.setup();
    });

    it("should get create new item when persisting", async () => {
      await adaptor.persistItem("foo", { age: 5, id: "foo", name: "Hello" });
    });

    it("should getItem", async () => {
      expect(await adaptor.getItem("foo")).toEqual({
        age: 5,
        id: "foo",
        name: "Hello",
      });
    });

    it("should getItemLastUpdated", async () => {
      if (title === "Database") {
        expect(await adaptor.getItemLastUpdated("foo")).toBeInstanceOf(Date);
        expect(await adaptor.getItemLastUpdated("non-existent")).toBeNull();
      } else {
        expect(await adaptor.getItemLastUpdated("foo")).toBeNull();
      }
    });

    it("should get update existing when persisting", async () => {
      await adaptor.persistItem("foo", {
        age: 5,
        id: "updated",
        name: "Updated",
      });

      expect(await adaptor.getItem("foo")).toEqual({
        age: 5,
        id: "updated",
        name: "Updated",
      });
    });

    it("should remove existing item", async () => {
      expect(await adaptor.getItem("foo")).toEqual({
        age: 5,
        id: "updated",
        name: "Updated",
      });

      await adaptor.removeItem("foo");

      expect(await adaptor.getItem("foo")).toBeFalsy();
    });

    it("should insert new items when reseting state", async () => {
      await adaptor.resetState("id", [
        { age: 1, id: "id-1", name: "First Item" },
        { age: 2, id: "id-2", name: "Second Item" },
      ]);
    });

    it("should getAllItems", async () => {
      expect(await adaptor.getAllItems()).toEqual([
        { age: 1, id: "id-1", name: "First Item" },
        { age: 2, id: "id-2", name: "Second Item" },
      ]);
    });

    it("should getAllItems", async () => {
      expect(await adaptor.getAllAsKeyValuePair()).toEqual({
        "id-1": { age: 1, id: "id-1", name: "First Item" },
        "id-2": { age: 2, id: "id-2", name: "Second Item" },
      });
    });

    it("should wipe old data and create new items when reseting state", async () => {
      await adaptor.resetState("id", [
        { age: 4, id: "id-4", name: "Fourth Item" },
        { age: 3, id: "id-3", name: "Third Item" },
        { age: 2, id: "id-2", name: "Second Item" },
      ]);

      expect(await adaptor.getAllItems()).toEqual([
        { age: 4, id: "id-4", name: "Fourth Item" },
        { age: 3, id: "id-3", name: "Third Item" },
        { age: 2, id: "id-2", name: "Second Item" },
      ]);
    });

    it("should getAllItemsIn", async () => {
      expect(await adaptor.getAllItemsIn(["id-3", "id-2"])).toEqual([
        { age: 3, id: "id-3", name: "Third Item" },
        { age: 2, id: "id-2", name: "Second Item" },
      ]);
    });
  }
);
