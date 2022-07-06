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
      return res.status(200).json(await dataController.showData(entity, id));
    }
    if (req.method === 'PATCH') {
      return res.status(204).json(await dataController.updateData(entity, id, req.body.data));
    }
    if (req.method === 'DELETE') {
      return res.status(204).json(await dataController.deleteData(entity, id));
    }
  } catch (error) {
    return handleResponseError(res, error);
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
