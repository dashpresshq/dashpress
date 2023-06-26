declare module "randomstring";

/* The typing is for this library is very much out of sync */
declare module "react-quill";
declare module "prismjs/components/prism-core";

declare module "*.svg" {
  const content: string;
  export default content;
  export const ReactComponent = content;
}
