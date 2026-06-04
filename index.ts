const BRACKET_OPEN_C  = new Set([40, 91, 123]);
const BRACKET_CLOSE_C = new Set([41, 93, 125]);
// dprint-ignore
const DELIM_C = new Set([
  40, 41,  // ()
  91, 93,  // []
  123, 125 // {}
]);

// dprint-ignore
const Types = {
  TEXT: 0,
  BARE_OPEN: 10,    // (
  BARE_CLOSE: 11,   // )
  SQUARE_OPEN: 20,  // [
  SQUARE_CLOSE: 21, // ]
  CURLY_OPEN: 30,   // {
  CURLY_CLOSE: 31,  // }
} as const;

const ScopeTypes = {
  [Types.BARE_OPEN]: "Bare",
  [Types.BARE_CLOSE]: "Bare",
  [Types.SQUARE_OPEN]: "Square",
  [Types.SQUARE_CLOSE]: "Square",
  [Types.CURLY_OPEN]: "Curly",
  [Types.CURLY_CLOSE]: "Curly",
} as const;


type ValueOf<T> = T[keyof T];

export type ScopeType = ValueOf<typeof ScopeTypes>;

export interface Metadata {
  Title: string;
  Artists?: string[];
  Circles?: string[];
  Head?: string[];
  Tail?: Array<{
    type: ScopeType;
    value: string;
  }>;
}

type Span = {
  readonly start: number;
  readonly end: number;
};

interface Token {
  readonly type: ValueOf<typeof Types>;
  readonly span: Span;
}

interface Node extends Token {
  readonly children?: Node[];
}

function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  const len = source.length;

  while (i < len) {
    const char = source.charCodeAt(i);
    const start = i;
    i++;

    if (char === 32) {
      continue;
    }

    switch (char) {
      case 91: tokens.push({ type: Types.SQUARE_OPEN, span: { start, end: i } }); break;
      case 93: tokens.push({ type: Types.SQUARE_CLOSE, span: { start, end: i } }); break;
      case 40: tokens.push({ type: Types.BARE_OPEN, span: { start, end: i } }); break;
      case 41: tokens.push({ type: Types.BARE_CLOSE, span: { start, end: i } }); break;
      case 123: tokens.push({ type: Types.CURLY_OPEN, span: { start, end: i } }); break;
      case 125: tokens.push({ type: Types.CURLY_CLOSE, span: { start, end: i } }); break;
      default: {
        while (i < len && !DELIM_C.has(source.charCodeAt(i))) {
          i++;
        }

        tokens.push({
          type: Types.TEXT,
          span: {
            start,
            end: i,
          },
        });
        break;
      }
    }
  }

  return tokens;
}

function parse(tokens: Token[], start = 0, end = tokens.length): Node[] {
  const nodes: Node[] = [];
  let i = start;

  while (i < end) {
    const token = tokens[i];
    const type = token.type;

    if (type === Types.TEXT) {
      nodes.push(token);
      i++;
      continue;
    }

    // Even number for open, for close odd
    if (type % 2 === 0) {
      let depth = 1;
      let j = i + 1;

      while (j < end && depth > 0) {
        const typeJ = tokens[j].type;
        if (typeJ === type) depth++;
        if (typeJ === type + 1) depth--;
        j++;
      }

      if (depth === 0) {
        nodes.push({
          type: token.type,
          span: {
            start: token.span.start,
            end: tokens[j - 1].span.end,
          },
          children: parse(tokens, i + 1, j - 1),
        });
        i = j;
        continue;
      }
    }

    i++;
  }

  return nodes;
}

export function splitAt(source: string, start: number, end: number): string[] {
  const names: string[] = [];

  for (let i = start; i < end; i++) {
    const char = source.charCodeAt(i);

    // & =38
    // × =215
    if (char === 38 || char === 215) {
      // Look around to handle names such as `J&K`.
      const left = source.charCodeAt(i - 1);
      const right = source.charCodeAt(i + 1);
      if (left === 32 || right === 32) {
        if (i - start) {
          const name = source.substring(start, i).trim();
          if (name) names.push(name);
        }
        start = i + 1;
      }
      continue;
    }

    // , =44
    if (char === 44) {
      if (i - start) {
        const name = source.substring(start, i).trim();
        if (name) {
          names.push(name);
        }
      }
      start = i + 1;
    }
  }

  const name = source.substring(start, end).trim();
  if (name) {
    names.push(name);
  }

  return names;
}

function parseTitle(source: string, nodes: Node[], offset: number): [number, string] {
  const start = offset;

  if (nodes.length - start > 1) {
    for (let j = offset + 1; j < nodes.length; j++) {
      const node = nodes[j];
      const type = node.type;

      // I think that accepting technical scopes as part of a title is in bad taste,
      // but it fixes a rare issue where a specific typo just breaks everything.
      //
      // `(Head  [C (A)] T` is less common than `[C (A)  T` and `... T [Tail `, but worse.
      //       ^                                       ^                    ^
      //
      // if (type > Types.BARE_CLOSE) break;

      if (type === Types.TEXT) {
        // Fixes:
        // - `Title (Series) =Group=` (61)
        // - `Title (Series) - Copy`  (45)
        if ([61, 45].includes(source.charCodeAt(node.span.start))) break;

        offset = j;
      }
    }

    // Capture sticky scope as well
    offset += Number(
      nodes[offset + 1]?.type === Types.BARE_OPEN &&
        source.charCodeAt(nodes[offset + 1].span.start - 1) !== 32,
    );
  }

  return [
    offset,
    source.substring(
      nodes[start].span.start - Number(
        // `C (A) T` => `[C (A) T` (less diligent)
        BRACKET_OPEN_C.has(source.charCodeAt(nodes[start].span.start - 1)),
      ),
      nodes[offset].span.end + Number(
        // `Title Series` => `Title Series)`
        BRACKET_CLOSE_C.has(source.charCodeAt(nodes[offset].span.end)),
      ),
    ).trimEnd(),
  ];
}

function pushTail(metadata: Metadata, source: string, node: Node): void {
  (metadata.Tail ??= []).push({
    type: ScopeTypes[node.type],
    value: source.substring(
      node.span.start + 1,
      node.span.end - 1,
    ),
  });
}

export function parseFilename(src: string): Metadata {
  const source = src.trim();
  const metadata: Metadata = {
    Title: source,
  };

  const tokens = tokenize(source);
  if (tokens.length === 1) {
    return metadata;
  }

  const nodes = parse(tokens);

  let offset = 0;
  let titleParsed = false;

  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    switch (node.type) {
      case Types.TEXT: {
        if (titleParsed) {
          // [ENG] =WE ARE PROBABLY HERE= [DL]
          //       ^                    ^
          // TODO: Handle unorthodox tags?
          continue;
        }

        const [end, title] = parseTitle(source, nodes, index);
        metadata.Title = title;
        index = end;

        titleParsed = true;
        break;
      }

      case Types.BARE_OPEN: {
        if (index === offset) {
          offset++;

          if (Types.BARE_OPEN === nodes[index + 1]?.type) {
            continue;
          }

          if (Types.SQUARE_OPEN === nodes[index + 1]?.type) {
            const start = node.span.start + 1;
            const end = node.span.end - 1;

            metadata.Head = splitAt(source, start, end);
            continue;
          }
        }

        if (!titleParsed && Types.TEXT === nodes[index + 1]?.type) {
          const [end, title] = parseTitle(source, nodes, index);
          metadata.Title = title;
          index = end;

          titleParsed = true;
          continue;
        }

        if (titleParsed) {
          pushTail(metadata, source, node);
        }
        break;
      }

      case Types.SQUARE_OPEN: {
        if (index === offset) {
          const children = node?.children;
          const len = children?.length;

          if (!len) {
            offset++;
            continue;
          }

          const firstChild = children[0];
          if (len > 1 && firstChild.type === Types.TEXT) {
            const lastChild = children[len - 1];

            if (lastChild.type === Types.BARE_OPEN) {
              metadata.Circles = splitAt(source, firstChild.span.start, children[len - 2].span.end);
              metadata.Artists = splitAt(source, lastChild.span.start + 1, lastChild.span.end - 1);
              continue;
            }
          }

          // [AI Decensored] [... (...)?] ...
          // ^             ^
          if (Types.SQUARE_OPEN === nodes[index + 1]?.type) {
            offset++;
            continue;
          }

          metadata.Artists = splitAt(source, node.span.start + 1, node.span.end - 1);
          continue;
        }

        if (titleParsed) {
          pushTail(metadata, source, node);
        }
        break;
      }

      case Types.CURLY_OPEN: {
        if (titleParsed) {
          pushTail(metadata, source, node);
        }
        offset++;
        break;
      }

      default:
        break;
    }
  }

  if (source === metadata.Title) {
    return { Title: source };
  }

  return metadata;
}
