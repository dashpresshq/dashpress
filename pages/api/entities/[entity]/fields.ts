// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { entitiesController } from '../../../../backend/entities/entities.controller';
import { validateEntityFromRequest } from '../../../../backend/entities/entities.validations';
import { handleResponseError } from '../../../../backend/lib/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const entity = validateEntityFromRequest(req.query);

    res.status(200).json(await entitiesController.getEntityFields(entity));
  } catch (error) {
    handleResponseError(res, error);
  }
}
