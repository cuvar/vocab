import Fuse from "fuse.js";

export function searchWord(words: ListElement[], searched: string) {
    const wordsToSearchThrough = words.map((word) => word.word);

    const fuse = new Fuse(wordsToSearchThrough, {
        includeScore: true,
        shouldSort: true,
    });

    const res = fuse.search(searched).map((w) => w.item);
    const firstResults = res.slice(0,5);

    const resultWordObjects: (ListElement | null)[] = firstResults.map((r) => {
        const res = words.find((el) => el.word == r);
        if (res == undefined) return null;
        return res;
    });

    return resultWordObjects;
}