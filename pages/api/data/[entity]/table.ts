import type { NextApiRequest, NextApiResponse } from 'next';
import { dataController } from '../../../../backend/data/data.controller';
import { validateEntityFromRequest } from '../../../../backend/entities/entities.validations';
import { handleResponseError } from '../../../../backend/lib/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const entity = validateEntityFromRequest(req.query);
    res.status(200).json(await dataController.tableData(entity, req.query));
  } catch (error) {
    handleResponseError(res, error);
  }
}
