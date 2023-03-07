/* eslint-disable no-param-reassign */
export function SingleMetaDataDataTransformer<T>(
  input: T & { createdAt?: string; updatedAt?: string }
): T {
  delete input.createdAt;
  delete input.updatedAt;
  return input;
}

export function MultipleMetaDataDataTransformer<T>(
  input: Array<T & { createdAt?: string; updatedAt?: string }>
): T[] {
  return input.map(SingleMetaDataDataTransformer);
}
