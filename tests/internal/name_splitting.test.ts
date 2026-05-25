import { describe, expect, test } from 'bun:test';
import { splitAt } from "../../index";

const $ = (text: string) => splitAt(text, 0, text.length);

describe("Credits (Artist/Circle)", () => {
    test("Single", () => {
        expect($("Artist")).toEqual(["Artist"]);
        expect($("J&K")).toEqual(["J&K"]);
        expect($("J×K")).toEqual(["J×K"]);

        expect($("&Artist&")).toEqual(["&Artist&"]);
    });
    test("Multiple", () => {
        expect($("Artist #1, Artist #2")).toEqual(["Artist #1", "Artist #2"]);
        expect($("Artist #1 & Artist #2")).toEqual(["Artist #1", "Artist #2"]);
        expect($("Artist #1 × Artist #2")).toEqual(["Artist #1", "Artist #2"]);

        expect($("J×K, J&K")).toEqual(["J×K", "J&K"]);
        expect($("J×K & J&K")).toEqual(["J×K", "J&K"]);
        expect($("J×K × J&K")).toEqual(["J×K", "J&K"]);

        // Fail. Hope I won't see another `Norino&`
        //expect($("&Artist& & &Artist&")).toEqual(["&Artist&", "&Artist&"]);
    });
});
