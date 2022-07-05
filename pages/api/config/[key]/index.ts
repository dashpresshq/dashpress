import type { NextApiRequest, NextApiResponse } from 'next';
import { configurationController } from '../../../../backend/configuration/configuration.controller';
import { validateConfigKeyFromRequest } from '../../../../backend/configuration/configuration.validations';
import { handleResponseError } from '../../../../backend/lib/errors';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const key = validateConfigKeyFromRequest(req.query);
    if (req.method === 'GET') {
      return res
        .status(200)
        .json(await configurationController.showConfig(key));
    } if (req.method === 'PUT') {
      return res
        .status(204)
        .json(await configurationController.upsertConfig(key, req.body.data));
    }
  } catch (error) {
    return handleResponseError(res, error);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
