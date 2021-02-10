module.exports.diff = (before, after) => {
    const diffs = []

    after.forEach(player => {
        const old = before.find(past => player.id === past.id)

        if (!old) {
            player.old_rank = null
            player.old_rank_diff = Infinity
            return diffs.push(player)
        }

        if (player.rank === old.rank) {
            return
        }

        player.old_rank = old.rank
        player.old_rank_diff = player.old_rank - player.rank
        diffs.push(player)
    })

    return diffs.sort((a, b) => b.old_rank_diff - a.old_rank_diff)
}
