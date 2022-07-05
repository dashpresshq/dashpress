import type { NextApiRequest, NextApiResponse } from 'next';
import { entitiesController } from '../../../backend/entities/entities.controller';
import { handleResponseError } from '../../../backend/lib/errors';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    res.status(200).json(await entitiesController.getMenuEntities());
  } catch (error) {
    handleResponseError(res, error);
  }
}
