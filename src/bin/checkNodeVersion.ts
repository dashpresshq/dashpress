import { versions } from "process";

const MINIMUM_NODE_VERSION = 16;

type VersionResponse =
  | { status: true; message: string }
  | { status: false; message: string };

export const checkNodeVersion = (): VersionResponse => {
  const nodeVersion = versions.node;

  if (+nodeVersion.split(".")[0] < MINIMUM_NODE_VERSION) {
    return {
      status: false,
      message: `Your node version ${nodeVersion} is not officially supported. Kindly upgrade to version <=${MINIMUM_NODE_VERSION} before reporting any issues.`,
    };
  }
  return {
    status: true,
    message: nodeVersion,
  };
};
