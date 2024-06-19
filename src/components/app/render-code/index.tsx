import styled from "styled-components";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import { PrismTokenStyles } from "./styles";

export interface IProps {
  input: object | string;
}

const Root = styled.div`
  overflow-x: auto;
  margin-bottom: 1rem;

  pre {
    min-height: 50px;
  }

  pre[class*="language-"].line-numbers {
    position: relative;
    padding-left: 3.8em;
    counter-reset: linenumber;
  }

  pre[class*="language-"].line-numbers > code {
    position: relative;
    white-space: inherit;
  }

  .line-numbers .line-numbers-rows {
    position: absolute;
    pointer-events: none;
    top: 0;
    font-size: 100%;
    left: -3.8em;
    width: 3em; /* works for line-numbers below 1000 lines */
    letter-spacing: -1px;
    border-right: 1px solid #999;

    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .line-numbers-rows > span {
    display: block;
    counter-increment: linenumber;
  }

  .line-numbers-rows > span:before {
    content: counter(linenumber);
    color: #999;
    display: block;
    padding-right: 0.8em;
    text-align: right;
  }

  ${PrismTokenStyles}
`;

export function RenderCode({ input }: IProps) {
  return (
    <Root className="line-numbers">
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
    </Root>
  );
}
