const { diff } = require('./differ')

describe("differ", () => {
    test("it should identify rank changes", () => {
        const input = {
            "before": [
                { id: "A", rank: 1 },
                { id: "B", rank: 2 },
                { id: "C", rank: 3 },
                { id: "D", rank: 4 },
            ],
            "after": [
                { id: "A", rank: 1 },
                { id: "C", rank: 2 },
                { id: "B", rank: 3 },
                { id: "D", rank: 4 },
            ]
        };

        const expected = [
            { id: "C", old_rank: 3, rank: 2, old_rank_diff: 1 },
            { id: "B", old_rank: 2, rank: 3, old_rank_diff: -1 },
        ];

        const actual = diff(input.before, input.after)
        expect(actual).toEqual(expected);
    });

    test("it should initialize new players on leaderboard", () => {
        const input = {
            "before": [
                { id: "A", rank: 1 },
                { id: "B", rank: 2 },
                { id: "C", rank: 3 },
                { id: "D", rank: 4 },
            ],
            "after": [
                { id: "A", rank: 1 },
                { id: "C", rank: 2 },
                { id: "B", rank: 3 },
                { id: "D", rank: 4 },
                { id: "E", rank: 5 },
            ]
        };

        const expected = [
            { id: "E", old_rank: null, rank: 5, old_rank_diff: Infinity },
            { id: "C", old_rank: 3, rank: 2, old_rank_diff: 1 },
            { id: "B", old_rank: 2, rank: 3, old_rank_diff: -1 },
        ];

        const actual = diff(input.before, input.after)
        expect(actual).toEqual(expected);
    });

    // currently depends on ranker returning a sorted order to start with
    test("it should sort new players by rank", () => {
        const input = {
            "before": [
                { id: "A", rank: 1 },
                { id: "B", rank: 2 },
            ],
            "after": [
                { id: "A", rank: 1 },
                { id: "E", rank: 2 },
                { id: "B", rank: 3 },
                { id: "C", rank: 4 },
                { id: "D", rank: 5 },
            ]
        };

        const expected = [
            { id: "E", old_rank: null, rank: 2, old_rank_diff: Infinity },
            { id: "C", old_rank: null, rank: 4, old_rank_diff: Infinity },
            { id: "D", old_rank: null, rank: 5, old_rank_diff: Infinity },
            { id: "B", old_rank: 2, rank: 3, old_rank_diff: -1 },
        ];

        const actual = diff(input.before, input.after)
        expect(actual).toEqual(expected)
    });
});
