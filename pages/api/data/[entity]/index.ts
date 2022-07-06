import type { NextApiRequest, NextApiResponse } from "next";
import { dataController } from "../../../../backend/data/data.controller";
import { validateEntityFromRequest } from "../../../../backend/entities/entities.validations";
import { handleResponseError } from "../../../../backend/lib/errors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const entity = validateEntityFromRequest(req.query);

    if (req.method === "GET") {
      return res.status(200).json(await dataController.listData(entity));
    }
    if (req.method === "POST") {
      return res
        .status(204)
        .json(await dataController.createData(entity, req.body.data));
    }
    // TODO
    //   if (req.method === "PATCH") {
    //     return res
    //       .status(204)
    //       .json(
    //         await dataController.updateManyData(
    //           entity,
    //           id
    //         )
    //       );
    //   }
    //   if (req.method === "DELETE") {
    //     return res
    //       .status(204)
    //       .json(
    //         await dataController.deleteManyData(
    //           entity,
    //           id
    //         )
    //       );
    //   }
  } catch (error) {
    return handleResponseError(res, error);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
