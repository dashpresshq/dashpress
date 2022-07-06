import type { NextApiRequest, NextApiResponse } from 'next';
import { configurationController } from '../../../../backend/configuration/configuration.controller';
import { validateConfigKeyFromRequest } from '../../../../backend/configuration/configuration.validations';
import { validateEntityFromRequest } from '../../../../backend/entities/entities.validations';
import { handleResponseError } from '../../../../backend/lib/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const entity = validateEntityFromRequest(req.query);
    const key = validateConfigKeyFromRequest(req.query, entity);
    if (req.method === 'GET') {
      return res.status(200).json(await configurationController.showConfig(key, entity));
    }
    if (req.method === 'PUT') {
      return res
        .status(204)
        .json(await configurationController.upsertConfig(key, req.body.data, entity));
    }
  } catch (error) {
    return handleResponseError(res, error);
  }
  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
