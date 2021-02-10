const { rank } = require('./ranker')

describe("ranker", () => {
    test("it should rank by points/games", () => {
        const input = [
            { id: "A", points: 4, games: 5 },
            { id: "B", points: 0, games: 5 },
            { id: "C", points: 8, games: 5 },
            { id: "D", points: 8, games: 4 },
        ];

        const expected = [
            { id: "D", points: 8, games: 4, ratio: 2,   rank: 1 },
            { id: "C", points: 8, games: 5, ratio: 1.6, rank: 2 },
            { id: "A", points: 4, games: 5, ratio: 0.8, rank: 3 },
        ];

        expect(rank(input)).toEqual(expected);
    });

    test("it should tie ranks", () => {
        const input = [
            { id: "A", points: 4, games: 5 },
            { id: "B", points: 2, games: 5 },
            { id: "C", points: 4, games: 5 },
            { id: "D", points: 8, games: 4 },
        ];

        const expected = [
            { id: "D",  points: 8, games: 4, ratio: 2,   rank: 1 },
            { id: "A",  points: 4, games: 5, ratio: 0.8, rank: 2 },
            { id: "C",  points: 4, games: 5, ratio: 0.8, rank: 2 },
            { id: "B",  points: 2, games: 5, ratio: 0.4,   rank: 3 },
        ];

        expect(rank(input)).toEqual(expected);
    });
});
