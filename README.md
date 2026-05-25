Doujin format refers to a loose naming convention where each typed block and its position corresponds to specific metadata. The most common and complete example would be `(Head) [Circle (Artist & Artist #2)] Title (tail) [tail2] {tail3}`.

Apart from having to deal with constant changes in structure and order, you might also find that encountering plain text is not conclusive evidence of having found a title – titles themselves might also contain scopes at the [start](https://github.com/WiseMan6/doujin-format-parser/blob/f3505c27496d2b5753fd0043bbb508669241411f/tests/parser/real-world.test.ts#L57-L58), at the [end](https://github.com/WiseMan6/doujin-format-parser/blob/f3505c27496d2b5753fd0043bbb508669241411f/tests/parser/real-world.test.ts#L84-L85), and in the [middle](https://github.com/WiseMan6/doujin-format-parser/blob/f3505c27496d2b5753fd0043bbb508669241411f/tests/parser/real-world.test.ts#L65-L66). Worse yet, because these constructions are mostly composed by hand, they are prone to typical typos like [duplicated](https://github.com/WiseMan6/doujin-format-parser/blob/f3505c27496d2b5753fd0043bbb508669241411f/tests/parser/synthetical/malformed.test.ts#L9) or [unclosed](https://github.com/WiseMan6/doujin-format-parser/blob/f3505c27496d2b5753fd0043bbb508669241411f/tests/parser/synthetical/malformed.test.ts#L35-L36) brackets, where the latter may cause the content to spill out – something I tried to handle as carefully as I could.

## Examples
Simple example:
```typescript
import { parseFilename } from "./index.ts";

parseFilename("[Artist, Artist2] Normal title");

// Result:
{
  Title: "Normal title",
  Artists: [ "Artist", "Artist2" ],
}
```

Complex example:
```typescript
parseFilename("{EHT Warning} (Head) [Circle (Artist & Artist (2))] (I'm) definitely (not) a (complex) title(2) (tag (1)) [tag [2]] {tag {3}} =unorthodox tag=");

// Result:
{
  Title: "(I'm) definitely (not) a (complex) title(2)",
  Head: [ "Head" ],
  Artists: [ "Artist", "Artist (2)" ],
  Circles: [ "Circle" ],
  Tail: [
    { type: "Bare", value: "tag (1)" },
    { type: "Square", value: "tag [2]" },
    { type: "Curly", value: "tag {3}" }
  ]
}
```

## Variations
- Filenames such as `(...) [AI Gen][...] ... (...)` would be parsed with `AI Gen` part omitted, favoring the last block by type, unless better match is found.

- Filenames such as `So I'm a Spider, So What v01 [Yen Press] [LuCaZ] {r2}` work without any omission, but you'd have to do all the guesswork about tags yourself, or use the script as a sanitizing tool instead.

- Filenames without a clear title would be parsed as-is, unless malformed. For example: `[U2 Offer] [BDMV][葬送的芙莉莲] [ Frieren: Beyond Journey's End ] [葬送のフリーレン][BDMV][1080p]`.


## Limitations
- It does not sanitize input beyond simple whitespace trimming, meaning that technical suffixes such as file extensions should be avoided.

- Can you tell if `[Artist(ic)] ...` refer to a person by the name `Artist(ic)`, or a person named `ic` assotiated with `Artist` group? Those kind of names are rare, but common as typos, so the answer would be the later, unless this assumption *proves* to be unreliable. For instance, with `[Artist(ic) & Friend]`, the former intepretation is assummed instead. The parser is syntactic in nature.
