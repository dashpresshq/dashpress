import type { NextApiRequest, NextApiResponse } from 'next';
import { entitiesController } from '../../../backend/entities/entities.controller';
import { handleResponseError } from '../../../backend/lib/errors';

export default function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(entitiesController.listAllEntities());
  } catch (error) {
    handleResponseError(res, error);
  }
}
