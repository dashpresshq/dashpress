const DB_NAME = "__dp__";
const DB_STORE_NAME = "app";

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
      DbStorage._dbInstance.createObjectStore(DB_STORE_NAME, {
        keyPath: "id",
      });
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

  async upsert(key: string, value: T): Promise<void> {
    (await this.getObjectStore("readwrite")).put({ key, value });
  }

  async get(key: string): Promise<T> {
    return (await this.getRequestResult(
      (await this.getObjectStore("readonly")).get(key)
    )) as T;
  }

  async remove(key: string): Promise<void> {
    return (await this.getObjectStore("readwrite")).delete(key).result;
  }

  async clear() {
    return (await this.getObjectStore("readwrite")).clear();
  }

  async destroy() {
    if (await DbStorage.getInstance()) {
      DbStorage._dbInstance.close();
      DbStorage._dbInstance = null;
    }
  }

  private async getObjectStore(mode: "readonly" | "readwrite") {
    const tx = (await DbStorage.getInstance()).transaction(DB_STORE_NAME, mode);

    return tx.objectStore(DB_STORE_NAME);
  }

  private async getRequestResult(request: IDBRequest) {
    return await new Promise((resolve) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        const errorMessage = request.error?.message || "something went wrong";
        resolve(errorMessage);
        throw new Error(errorMessage);
      };
    });
  }
}
