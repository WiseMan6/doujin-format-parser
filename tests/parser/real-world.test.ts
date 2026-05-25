import { describe, expect, test } from 'bun:test';
import { bare, square } from "./utils";
import { parseFilename } from "../../index";

const $ = parseFilename;

describe("Real World", () => {
    test("Normal", () => {
        expect($("(C91) [wadamemo (WADA Rco)] Fate GO MEMO (Fate/Grand Order)")).toEqual({
            Title: "Fate GO MEMO",
            Artists: ["WADA Rco"],
            Circles: ["wadamemo"],
            Head: ["C91"],
            Tail: [bare`Fate/Grand Order`]
        });

        // Omission

        expect($("(CCOsaka107) [Haraheridou (Herio)] Yodooshi Lamretta (Granblue Fantasy) [English] =White Symphony=")).toEqual({
            Title: "Yodooshi Lamretta",
            Artists: ["Herio"],
            Circles: ["Haraheridou"],
            Head: ["CCOsaka107"],
            Tail: [
                bare `Granblue Fantasy`,
                square `English`
            ]
        });

        expect($("{EHT PERSONALIZED TORRENT - DO NOT REDISTRIBUTE} [COMEX (Zhen Lu)] Moto Mahou Shoujo no Shigoto Hanashi Ao The Former Magical Girl Blue's Work [English] [flowerswamp] [Digital]")).toEqual({
            Title: "Moto Mahou Shoujo no Shigoto Hanashi Ao The Former Magical Girl Blue's Work",
            Artists: ["Zhen Lu"],
            Circles: ["COMEX"],
            Tail: [
                square `English`,
                square `flowerswamp`,
                square `Digital`
            ]
        });

        expect($("[AI Decensored][Buryuburyu Tokoroten Milk (Yapo)] Cagliostro to Himitsu no Renkinjutsu | 与卡莉奥丝特罗的秘密炼金术 (Granblue Fantasy) [Chinese] [田中罗密欧个人汉化] [Decensored] [Digital]")).toEqual({
            Title: "Cagliostro to Himitsu no Renkinjutsu | 与卡莉奥丝特罗的秘密炼金术",
            Artists: ["Yapo"],
            Circles: ["Buryuburyu Tokoroten Milk"],
            Tail: [
                bare `Granblue Fantasy`,
                square `Chinese`,
                square `田中罗密欧个人汉化`,
                square `Decensored`,
                square `Digital`,
            ]
        });
    });


    test("Scoped Titles (Start)", () => {
        expect($("[Spiritus Tarou] (Pretend) Sleeping Beauty (Comic Bavel 2016-04)")).toEqual({
            Title: "(Pretend) Sleeping Beauty",
            Artists: ["Spiritus Tarou"],
            Tail: [bare`Comic Bavel 2016-04`]
        });
    });

    test("Scoped Titles (Middle)", () => {
        expect($("[Horizontal World (Matanonki)] Love It (One) More (Blue Archive) [English] [Team Rabu2]")).toEqual({
            Title: "Love It (One) More",
            Artists: ["Matanonki"],
            Circles: ["Horizontal World"],
            Tail: [
                bare `Blue Archive`,
                square `English`,
                square `Team Rabu2`
            ]
        });

        expect($(`[Esuke] The Beast's Gratitude(?) 2`)).toEqual({
            Title: "The Beast's Gratitude(?) 2",
            Artists: ["Esuke"]
        });
    });

    test("Scoped Titles (End)", () => {
        // Best way to go about it without dictionaries, which aren't very helpful
        expect($(`[Esuke] The Beast's Gratitude(?)`)).toEqual({
            Title: "The Beast's Gratitude(?)",
            Artists: ["Esuke"]
        });
    });


    test("Malformed", () => {
        expect($("[Aigamodou (Ayakawa Riku) Isekai Elf Hatsujou no Magan 8 ~Succubus Netori Hen~ [Digital]")).toEqual({
            Title: "[Aigamodou (Ayakawa Riku) Isekai Elf Hatsujou no Magan 8 ~Succubus Netori Hen~",
            Tail: [square`Digital`]
        });

        expect($("[Yamamoto Tomomitsu] We're No-Nonsense Goody Two Shoes (x3200) FAKKU]")).toEqual({
            Title: "We're No-Nonsense Goody Two Shoes (x3200) FAKKU]",
            Artists: ["Yamamoto Tomomitsu"]
        });
    });
});
