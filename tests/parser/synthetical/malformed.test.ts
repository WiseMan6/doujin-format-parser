import { describe, expect, test } from 'bun:test';
import { bare, square } from "../utils";
import { parseFilename } from "../../../index";

const $ = parseFilename;

describe("Malformed", () => {
    test("Gibberish (Cherry-picked)", () => {
        expect($(`[[ [Circle (Artist))))))] [[)Title ((Series)))) [[[Language] [[[TL Group]))`)).toEqual({
            Title: "Title",
            Artists: ["Artist"],
            Circles: ["Circle"],
            Tail: [
                bare `(Series)`,
                square `Language`,
                square `TL Group`
            ]
        });
    });

    test("Mismatch", () => {
        expect($("[Artist] Title (Series] [Lang]")).toEqual({
            Title: "Title (Series]",
            Artists: ["Artist"],
            Tail: [square`Lang`]
        });
        expect($("[Artist] Title [Series) [Lang]")).toEqual({
            Title: "Title [Series)",
            Artists: ["Artist"],
            Tail: [square`Lang`]
        });
    });

    test("Unclosed", () => {
        expect($("[Artist] Title (Series [Lang]")).toEqual({
            Title: "Title (Series",
            Artists: ["Artist"],
            Tail: [square`Lang`]
        });
        expect($("[Artist] Title Series) [Lang]")).toEqual({
            Title: "Title Series)",
            Artists: ["Artist"],
            Tail: [square`Lang`]
        });

        // Isolated
        expect($("[Artist (Circle] Title")).toEqual({
            Title: "Title",
            Artists: ["Artist (Circle"]
        });
        expect($("[Artist Circle)] Title")).toEqual({
            Title: "Title",
            Artists: ["Artist Circle)"]
        });
    });
});
