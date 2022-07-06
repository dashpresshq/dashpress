import type { NextApiRequest, NextApiResponse } from 'next';
import { enumsController } from '../../../backend/enums/enums.controller';
import { validateEnumNameFromRequest } from '../../../backend/enums/enums.validation';
import { handleResponseError } from '../../../backend/lib/errors';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const name = validateEnumNameFromRequest(req.query);

    if (req.method === 'GET') {
      return res.status(200).json(enumsController.listEnumValues(name));
    }
  } catch (error) {
    return handleResponseError(res, error);
  }
  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
