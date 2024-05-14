/* eslint-disable max-classes-per-file */

const DB_NAME = "__dp__";

export class DbStorage<T> {
  static _dbInstance: IDBDatabase | null = null;

  constructor() {}

  static async getInstance() {
    if (this._dbInstance) {
      return this._dbInstance;
    }

    this.init();

    return this._dbInstance;
  }

  static async init() {
    if (DbStorage._dbInstance) {
      return;
    }

    const request = window.indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      DbStorage._dbInstance = (event.target as IDBOpenDBRequest).result;
      //   if (!this.db!.objectStoreNames.contains(this.dbName)) {
      DbStorage._dbInstance.createObjectStore(DB_NAME, {
        keyPath: "id",
        autoIncrement: true,
      });
      // }
    };

    await new Promise((resolve, reject) => {
      request.onsuccess = () => {
        DbStorage._dbInstance = request.result;
        resolve(true);
      };

      request.onerror = () => {
        reject(Error("Error could not initialize"));
      };
    });
  }

  private async getObjectStore(mode: "readonly" | "readwrite") {
    const tx = (await DbStorage.getInstance()).transaction(DB_NAME, mode);

    return tx.objectStore(DB_NAME);

    // await new Promise((resolve) => {
    //     request.onsuccess = () => {
    //       resolve(request.result);
    //     };
    //     request.onerror = () => {
    //       const errorMessage = request.error?.message || "something went wrong";
    //       resolve(errorMessage);
    //       throw new Error(errorMessage);
    //     };
    //   });
  }

  async upsert(key: string, value: T): Promise<void> {
    (await this.getObjectStore("readwrite")).put({ key, value });
  }

  async list(): Promise<T[]> {
    return (await this.getObjectStore("readonly")).getAll().result;
  }

  async get(key: string): Promise<T> {
    return (await this.getObjectStore("readonly")).get(key).result;
  }

  async remove(key: string): Promise<void> {
    return (await this.getObjectStore("readwrite")).delete(key).result;
  }

  async clear() {
    return (await this.getObjectStore("readwrite")).clear();
  }

  async keys() {
    return (await this.getObjectStore("readonly")).getAllKeys();
  }

  async exists(key: string): Promise<boolean> {
    const data = await this.get(key);
    return !!data;
  }

  async count(): Promise<number> {
    const keys = await this.keys();
    return keys.result.length;
  }

  async destroy() {
    if (await DbStorage.getInstance()) {
      DbStorage._dbInstance.close();
      DbStorage._dbInstance = null;
    }
  }
}

// export class DB {
//   private db: IDBDatabase | null = null;

//   private version = 1;

//   constructor(private dbName: string) {}
// }
