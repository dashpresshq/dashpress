import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import styles from "./styles.module.css";
import { cn } from "@/lib/utils";

export interface IProps {
  input: object | string;
}

export function RenderCode({ input }: IProps) {
  return (
    <div
      className={cn("rounded-lg text-sm p-2 mb-1 overflow-x-auto", styles.root)}
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
