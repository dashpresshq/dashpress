import styled from "styled-components";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";

interface IProps {
  input: object;
}

const Root = styled.div`
  overflow-x: auto;

  pre {
    min-height: 50px;
  }

  .token.cdata,
  .token.comment,
  .token.doctype,
  .token.prolog {
    color: #90a4ae;
  }

  .token.punctuation {
    color: #9e9e9e;
  }

  .namespace {
    opacity: 0.7;
  }

  .token.boolean,
  .token.constant,
  .token.deleted,
  .token.number,
  .token.property,
  .token.symbol,
  .token.tag {
    color: #e91e63;
  }

  .token.attr-name,
  .token.builtin,
  .token.char,
  .token.inserted,
  .token.selector,
  .token.string {
    color: #4caf50;
  }

  .language-css .token.string,
  .style .token.string,
  .token.entity,
  .token.operator,
  .token.url {
    color: #795548;
  }

  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: #3f51b5;
  }

  .token.function {
    color: #f44336;
  }

  .token.important,
  .token.regex,
  .token.variable {
    color: #ff9800;
  }

  .token.bold,
  .token.important {
    font-weight: 700;
  }

  .token.italic {
    font-style: italic;
  }

  .token.entity {
    cursor: help;
  }
`;
// TODO from chromista
export function RenderCode({ input }: IProps) {
  return (
    <Root>
      <pre
        dangerouslySetInnerHTML={{
          __html: highlight(
            JSON.stringify(input || {}, null, 2),
            languages.javascript
          ),
        }}
      />
    </Root>
  );
}
