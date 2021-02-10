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
            .map(calculateRatio)
            .sort(sortByRatio)
    )
}
