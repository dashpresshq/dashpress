import { ConfigService } from "backend/lib/config/config.service";
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
      new ConfigService({}, false)
    ),
  },
  {
    title: "Memory",
    adaptor: new MemoryConfigDataPersistenceAdaptor<ITestData>(
      TEST_DOMAIN,
      new ConfigService({}, false)
    ),
  },
  {
    title: "Database",
    adaptor: new DatabaseConfigDataPersistenceAdaptor<ITestData>(
      TEST_DOMAIN,
      new ConfigService(
        {
          CONFIG_ADAPTOR_CONNECTION_STRING: "sqlite3:./test-adaptor.sqlite",
        },
        false
      )
    ),
  },
  {
    title: "Redis",
    adaptor: new RedisConfigDataPersistenceAdaptor<ITestData>(
      TEST_DOMAIN,
      new ConfigService(
        {
          CONFIG_ADAPTOR_CONNECTION_STRING: "redis://localhost",
        },
        false
      )
    ),
  },
];

describe.each(PERSITENT_ADAPTORS)(
  "$title persistence adaptor",
  ({ adaptor }) => {
    beforeAll(async () => {
      await adaptor.setup();
    });

    it("should get create new item when upserting", async () => {
      await adaptor.upsertItem("foo", { age: 5, id: "foo", name: "Hello" });
    });

    it("should getItem", async () => {
      expect(await adaptor.getItem("foo")).toEqual({
        age: 5,
        id: "foo",
        name: "Hello",
      });
    });

    it("should get update existing when upserting", async () => {
      await adaptor.upsertItem("foo", {
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
      expect(await adaptor.getAllItemsIn(["id-2", "id-3"])).toEqual([
        { age: 2, id: "id-2", name: "Second Item" },
        { age: 3, id: "id-3", name: "Third Item" },
      ]);
    });
  }
);
