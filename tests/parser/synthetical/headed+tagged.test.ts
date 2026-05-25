import { describe, expect, test } from 'bun:test';
import { bare, square, curly } from "../utils";
import { parseFilename } from "../../../index";

const $ = parseFilename;

console.log("———————————— HEADED (Tagged)");

describe("Artists", () => {
    test("Simple", () => {
        expect($("(Head) [Artist & Artist #2] normal title (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "normal title",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
        expect($("(Head) [Artist & Artist #2] normal title(2) (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "normal title(2)",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
    });

    test("Complex", () => {
        expect($("(Head) [Artist & Artist #2] Definitely (not) a (complex) title (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "Definitely (not) a (complex) title",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
        expect($("(Head) [Artist & Artist #2] Definitely (not) a (complex) title(2) (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "Definitely (not) a (complex) title(2)",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });

        //==
        expect($("(Head) [Artist & Artist #2] (I'm) definitely (not) a (complex) title (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "(I'm) definitely (not) a (complex) title",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
        expect($("(Head) [Artist & Artist #2] (I'm) definitely (not) a (complex) title(2) (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "(I'm) definitely (not) a (complex) title(2)",
            Artists: ["Artist", "Artist #2"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
    });
});


describe("+Circles", () => {
    test("Simple", () => {
        expect($("(Head) [Circle, Circle #2 (Artist & Artist #2)] normal title (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "normal title",
            Artists: ["Artist", "Artist #2"],
            Circles: ["Circle", "Circle #2"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
        expect($("(Head) [Circle, Circle #2 (Artist & Artist #2)] normal title(2) (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "normal title(2)",
            Artists: ["Artist", "Artist #2"],
            Circles: ["Circle", "Circle #2"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
    });

    test("Complex", () => {
        expect($("(Head) [Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "Definitely (not) a (complex) title",
            Artists: ["Artist", "Artist (2)"],
            Circles: ["Circle", "Circle(2)"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
        expect($("(Head) [Circle, Circle(2) (Artist & Artist (2))] Definitely (not) a (complex) title(2) (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "Definitely (not) a (complex) title(2)",
            Artists: ["Artist", "Artist (2)"],
            Circles: ["Circle", "Circle(2)"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });

        //==
        expect($("(Head) [Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "(I'm) definitely (not) a (complex) title",
            Artists: ["Artist", "Artist (2)"],
            Circles: ["Circle", "Circle(2)"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
        expect($("(Head) [Circle, Circle(2) (Artist & Artist (2))] (I'm) definitely (not) a (complex) title(2) (tag1) [tag2] {tag3} =tag4=")).toEqual({
            Title: "(I'm) definitely (not) a (complex) title(2)",
            Artists: ["Artist", "Artist (2)"],
            Circles: ["Circle", "Circle(2)"],
            Head: ["Head"],
            Tail: [
                bare `tag1`,
                square `tag2`,
                curly `tag3`
            ]
        });
    });
});
