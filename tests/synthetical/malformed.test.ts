import { describe, expect, test } from 'bun:test';
import { bare, square } from "../utils";
import { parseFilename } from "../../index";

const $ = parseFilename;

describe("Malformed", () => {
    test("Extra", () => {
        expect($(`[[ [Circle (Artist))))))] [[)Title (Series)))) [[[Language] [[[TL Group]))`)).toEqual({
            Title: "Title",
            Artists: ["Artist"],
            Circles: ["Circle"],
            Tail: [
                bare `Series`,
                square `Language`,
                square `TL Group`
            ]
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

        expect($("[Artist] Title [Lang [Group]")).toEqual({
            Title: "Title [Lang",
            Artists: ["Artist"],
            Tail: [square`Group`]
        });
        expect($("[Artist] Title Lang] [Group]")).toEqual({
            Title: "Title Lang]",
            Artists: ["Artist"],
            Tail: [square`Group`]
        });

        // Group is ignored completely. That's because the capture cannot
        // advance further once technical scope is found (either square or curly).
        expect($("[Artist] Title [Lang] [Group")).toEqual({
            Title: "Title",
            Artists: ["Artist"],
            Tail: [square`Lang`]
        });
        expect($("[Artist] Title [Lang] Group]")).toEqual({
            Title: "Title",
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
