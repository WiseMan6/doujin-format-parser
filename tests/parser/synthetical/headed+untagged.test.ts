import { describe, expect, test } from 'bun:test';
import { parseFilename } from "../../../index";

const $ = parseFilename;

console.log("———————————— HEADED");

describe("Artists", () => {
    test("Simple", () => {
        expect($("(Head) [Artist & Artist #2] normal title")).toEqual({
            Title: "normal title",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"]
        });
        expect($("(Head) [Artist & Artist #2] normal title(2)")).toEqual({
            Title: "normal title(2)",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"]
        });
    });

    test("Complex", () => {
        expect($("(Head) [Artist & Artist #2] Definitely (not) a (complex) title")).toEqual({
            Title: "Definitely (not) a (complex) title",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"]
        });
        expect($("(Head) [Artist & Artist #2] Definitely (not) a (complex) title(2)")).toEqual({
            Title: "Definitely (not) a (complex) title(2)",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"]
        });

        //==
        expect($("(Head) [Artist & Artist #2] (I'm) definitely (not) a (complex) title")).toEqual({
            Title: "(I'm) definitely (not) a (complex) title",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"]
        });
        expect($("(Head) [Artist & Artist #2] (I'm) definitely (not) a (complex) title(2)")).toEqual({
            Title: "(I'm) definitely (not) a (complex) title(2)",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"]
        });
    });
});


describe("+Circles", () => {
    test("Simple", () => {
        expect($("(Head) [Circle, Circle #2 (Artist & Artist #2)] normal title")).toEqual({
            Title: "normal title",
            Artists: ["Artist", "Artist #2"],
            Circles: ["Circle", "Circle #2"],
            Head: ["Head"]
        });
        expect($("(Head) [Circle, Circle #2 (Artist & Artist #2)] normal title(2)")).toEqual({
            Title: "normal title(2)",
            Artists: ["Artist", "Artist #2"],
            Circles: ["Circle", "Circle #2"],
            Head: ["Head"]
        });
    });

    test("Complex", () => {
        expect($("(Head) [Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title")).toEqual({
            Title: "Definitely (not) a (complex) title",
            Artists: ["Artist", "Artist (2)"],
            Circles: ["Circle", "Circle(2)"],
            Head: ["Head"]
        });
        expect($("(Head) [Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title(2)")).toEqual({
            Title: "Definitely (not) a (complex) title(2)",
            Artists: ["Artist", "Artist (2)"],
            Circles: ["Circle", "Circle(2)"],
            Head: ["Head"]
        });

        //==
        expect($("(Head) [Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title")).toEqual({
            Title: "(I'm) definitely (not) a (complex) title",
            Artists: ["Artist", "Artist (2)"],
            Circles: ["Circle", "Circle(2)"],
            Head: ["Head"]
        });
        expect($("(Head) [Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title(2)")).toEqual({
            Title: "(I'm) definitely (not) a (complex) title(2)",
            Artists: ["Artist", "Artist (2)"],
            Circles: ["Circle", "Circle(2)"],
            Head: ["Head"]
        });
    });
});
