import { dataApiService } from "backend/data/data.service";
import { requestHandler } from "backend/lib/request";
import { schemasApiService } from "backend/schema/schema.service";
import { noop } from "shared/lib/noop";

export default requestHandler(
  {
    GET: async () => {
      try {
        await dataApiService.runOnLoad();
        await schemasApiService.runOnLoad();
      } catch (error) {
        noop();
      }
      return {
        ok: true,
      };
    },
  },
  [
    {
      _type: "anyBody",
    },
  ]
);
