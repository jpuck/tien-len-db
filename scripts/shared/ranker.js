const MINIMUM_NUMBER_OF_GAMES_TO_GET_ON_LEADERBOARD = 10;

const applyRank = players => {
    let rank = 0
    let ratio = undefined

    players.map(player => {
        if (ratio !== player.ratio) {
            ratio = player.ratio
            rank++
        }

        player.rank = rank
        return player
    })

    return players
}

const calculateRatio = player => {
    player.ratio = player.points / player.games
    return player
}

const sortByRatio = (a, b) => {
    return b.ratio - a.ratio
}

module.exports.rank = players => {
    return applyRank(
        players
            .filter(player => player.points > 0)
            .filter(player => player.games >= MINIMUM_NUMBER_OF_GAMES_TO_GET_ON_LEADERBOARD)
            .map(calculateRatio)
            .sort(sortByRatio)
    )
}
