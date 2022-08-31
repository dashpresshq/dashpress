import {
  configurationService,
  ConfigurationService,
} from "backend/configuration/configuration.service";
import jsonwebtoken from "jsonwebtoken";
import { IAccountProfile } from "shared/types";
import {
  ConfigKeys,
  configService,
  ConfigService,
} from "../config/config.service";

interface IWithJWTMetadataAccountProfile extends IAccountProfile {
  iat: number;
  exp: number;
}

export class AuthTokenService {
  private authToken: string;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _configurationService: ConfigurationService
  ) {
    this.authToken = this._configService.getConfigValue(
      ConfigKeys.AUTH_TOKEN_KEY
    );
  }

  async verify(token: string): Promise<IWithJWTMetadataAccountProfile> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.verify(token, this.authToken, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        return resolve(decoded as IWithJWTMetadataAccountProfile);
      });
    });
  }

  async sign(payload: IAccountProfile): Promise<string> {
    const tokenValidityDurationInDays =
      await this._configurationService.getSystemSettings(
        "tokenValidityDurationInDays"
      );

    return jsonwebtoken.sign(payload, this.authToken, {
      expiresIn: `${tokenValidityDurationInDays}d`,
    });
  }
}

export const authTokenService = new AuthTokenService(
  configService,
  configurationService
);
