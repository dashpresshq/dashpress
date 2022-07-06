import type { NextApiRequest, NextApiResponse } from 'next';
import { dataController } from '../../../../../backend/data/data.controller';
import {
  validateEntityFromRequest,
  validateEntityIdFromRequest,
} from '../../../../../backend/entities/entities.validations';
import { handleResponseError } from '../../../../../backend/lib/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const entity = validateEntityFromRequest(req.query);
    const id = validateEntityIdFromRequest(req.query);

    if (req.method === 'GET') {
      return res.status(200).json(await dataController.referenceData(entity, id));
    }
  } catch (error) {
    return handleResponseError(res, error);
  }

  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
