import { noop } from "shared/lib/noop";
import { requestHandler } from "backend/lib/request";
import { dataApiService } from "backend/data/data.service";
import { schemasApiService } from "backend/schema/schema.service";

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
