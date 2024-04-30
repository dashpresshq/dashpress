import { PageConfig } from "next";
import { requestHandler } from "backend/lib/request";
import { BadRequestError } from "backend/lib/errors";
import { FORMIDABLE_ERRORS } from "backend/uploads/constants";
import { parseForm } from "backend/uploads/parse";

export default requestHandler(
  {
    POST: async (getValidatedRequest): Promise<Record<string, string>> => {
      try {
        const { rawRequest: req } = await getValidatedRequest(["rawRequest"]);

        const { files } = await parseForm(req);

        if (files.file.length === 0) {
          throw new BadRequestError("An invalid file was submitted");
        }

        const fileUrl = files.file[0].filepath;

        return {
          fileUrl,
        };
      } catch (error) {
        if (
          [FORMIDABLE_ERRORS.biggerThanTotalMaxFileSize].includes(error.code)
        ) {
          throw new BadRequestError(error.message);
        }

        throw error;
      }
    },
  },
  [
    {
      _type: "notAllowedOnDemo",
    },
  ]
);

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
};
