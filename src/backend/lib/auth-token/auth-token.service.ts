import {
  configurationApiService,
  ConfigurationApiService,
} from "backend/configuration/configuration.service";
import jsonwebtoken from "jsonwebtoken";
import { IAccountProfile } from "shared/types/user";
import {
  ConfigKeys,
  configApiService,
  ConfigApiService,
} from "../config/config.service";

interface IWithJWTMetadataAccountProfile extends IAccountProfile {
  iat: number;
  exp: number;
}

export class AuthTokenApiService {
  private authToken: string;

  constructor(
    private readonly _configApiService: ConfigApiService,
    private readonly _configurationApiService: ConfigurationApiService
  ) {
    this.authToken = this._configApiService.getConfigValue(
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
      await this._configurationApiService.getSystemSettings(
        "tokenValidityDurationInDays"
      );

    return jsonwebtoken.sign(payload, this.authToken, {
      expiresIn: `${tokenValidityDurationInDays}d`,
    });
  }
}

export const authTokenApiService = new AuthTokenApiService(
  configApiService,
  configurationApiService
);
