import { createConfigDomainPersistenceService } from "backend/lib/config-persistence";

const TEST_CREDENTIALS: Record<string, string> = {
  CREDENTIAL_KEY_1: "CREDENTIAL_KEY_1",

  DATABASE___dataSourceType:
    "aad0f7e776963ae66b7459222d54871433f8e119ab9a9712d4e82e8cbb77246e47a750a773c0ea316c110a1d3f2ee16c2509906fb89f1c4b039d09f139b1d7eacc26908c25137c46f269cfb13f63221da2f1631bf4f59cbe14cc18cbfb8993098bd7e2d865f20717",

  DATABASE___connectionString:
    /* JSON.stringify("sqlite:./test.sqlite") */
    "cfe84f1c0ce195021dbe740b0088064276df13dd0d2a8dda4f007f78989d17a26562910709adc261c05f20f855d26a89284effcdb6932ed618b0d8b6fb98fc6b0e9ebab8d53aa1570ec0e40e89db851e6987eed665f12dece0f31b7a4ffe3dcd1ee3f4ba0096b68a578d0d582507ae2cd62dfb255074",
  DATABASE___port:
    "68ba76e500daa5d670930d24bbb425018571f18decc16d63ed901b85f6e99f74d3cf68225dcceb677b9a080cb1e8e8fd50abccbcf7d45fcf24c9578395b05b8aec57a763694e92fdbd2836bb91e66f17dc338bce18ae54cbb17098e1f1894c39870d7ff1cd",
};

export const setupCredentialsTestData = async (
  credentials: Record<string, string> | false = TEST_CREDENTIALS
) => {
  const configPersistenceService =
    createConfigDomainPersistenceService("credentials");

  await configPersistenceService.resetToEmpty();

  if (credentials === false) {
    return;
  }

  const configAsArray = Object.entries(credentials);

  for (const [key, value] of configAsArray) {
    await configPersistenceService.upsertItem(key, value);
  }
};
