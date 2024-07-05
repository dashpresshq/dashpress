import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { cn } from "@/lib/utils";
import styles from "./styles.module.css";

export interface IProps {
  input: object | string;
}

export function RenderCode({ input }: IProps) {
  return (
    <div
      className={cn("mb-1 overflow-x-auto rounded-lg p-2 text-sm", styles.root)}
    >
      <pre>
        <code
          dangerouslySetInnerHTML={{
            __html: highlight(
              typeof input === "string"
                ? input
                : JSON.stringify(input || {}, null, 2),
              languages.javascript
            ),
          }}
        />
      </pre>
    </div>
  );
}
