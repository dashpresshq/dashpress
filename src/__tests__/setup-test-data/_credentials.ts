import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";

const TEST_CREDENTIALS: Record<string, unknown> = {
  database: {
    port: "68ba76e500daa5d670930d24bbb425018571f18decc16d63ed901b85f6e99f74d3cf68225dcceb677b9a080cb1e8e8fd50abccbcf7d45fcf24c9578395b05b8aec57a763694e92fdbd2836bb91e66f17dc338bce18ae54cbb17098e1f1894c39870d7ff1cd",
  },
};

export const setupCredentialsTestData = async (
  credentials: Record<string, unknown> | false = TEST_CREDENTIALS
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService("credentials");

  await configPersistenceService.resetToEmpty();

  if (credentials === false) {
    return;
  }

  const configAsArray = Object.entries(credentials);

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of configAsArray) {
    // eslint-disable-next-line no-await-in-loop
    await configPersistenceService.upsertItem(key, value);
  }
};
