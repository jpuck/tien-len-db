const { rank } = require('./ranker')

describe("ranker", () => {
    test("it should rank by points/games", () => {
        const input = [
            { id: "A", points: 40, games: 50 },
            { id: "B", points: 0,  games: 50 },
            { id: "C", points: 80, games: 50 },
            { id: "D", points: 80, games: 40 },
        ];

        const expected = [
            { id: "D", points: 80, games: 40, ratio: 2,   rank: 1 },
            { id: "C", points: 80, games: 50, ratio: 1.6, rank: 2 },
            { id: "A", points: 40, games: 50, ratio: 0.8, rank: 3 },
        ];

        expect(rank(input)).toEqual(expected);
    });

    test("it should tie ranks", () => {
        const input = [
            { id: "A", points: 40, games: 50 },
            { id: "B", points: 20, games: 50 },
            { id: "C", points: 40, games: 50 },
            { id: "D", points: 80, games: 40 },
        ];

        const expected = [
            { id: "D",  points: 80, games: 40, ratio: 2,   rank: 1 },
            { id: "A",  points: 40, games: 50, ratio: 0.8, rank: 2 },
            { id: "C",  points: 40, games: 50, ratio: 0.8, rank: 2 },
            { id: "B",  points: 20, games: 50, ratio: 0.4, rank: 3 },
        ];

        expect(rank(input)).toEqual(expected);
    });

    test("it should only rank players with at least 10 games", () => {
        const input = [
            { id: "A", points: 40, games: 50 },
            { id: "B", points: 20, games: 50 },
            { id: "C", points: 40, games: 50 },
            { id: "D", points: 8,  games: 8 },
        ];

        const expected = [
            { id: "A",  points: 40, games: 50, ratio: 0.8, rank: 1 },
            { id: "C",  points: 40, games: 50, ratio: 0.8, rank: 1 },
            { id: "B",  points: 20, games: 50, ratio: 0.4, rank: 2 },
        ];

        expect(rank(input)).toEqual(expected);
    });
});
