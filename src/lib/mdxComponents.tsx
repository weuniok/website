import { Blockquote } from "./prose/Blockquote";
import { Code, Pre } from "./prose/code-and-pre";
import { createHeading } from "./prose/Heading";
import { Ol } from "./prose/Ol";
import { Paragraph } from "./prose/Paragraph";
import { Table } from "./prose/Table";
import { Ul } from "./prose/Ul";
import { Link } from "./Link";

export const mdxComponents = {
  a: Link,
  Link,
  h1: createHeading("h1"),
  h2: createHeading("h2"),
  h3: createHeading("h3"),
  h4: createHeading("h4"),
  h5: createHeading("h5"),
  h6: createHeading("h6"),
  // img: Image,
  table: Table,
  ul: Ul,
  ol: Ol,
  blockquote: Blockquote,
  code: Code,
  pre: Pre,
  // Take note that `mdxComponents` replace only Markdown and uppercased components,
  // not inline lowercased JSX, so using `<p>` in and .mdx file won't use the `Paragraph`.
  p: Paragraph,
};
