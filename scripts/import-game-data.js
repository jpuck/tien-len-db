const fs = require('fs')
const csv = require('csv-parser')
const users = require('./shared/users')
const GAMES_FILENAME = process.argv[2]

const games = {}

users.reset()

fs.createReadStream(GAMES_FILENAME)
    .pipe(csv())
    .on('data', ({ json }) => {
        const { game } = JSON.parse(json)

        if (games[game.id]) {
            return
        } else {
            games[game.id] = true
        }

        // the total number of game points eligible to win is one for every non-bot player
        const eligible = game.players.reduce((total, player) => player.bot ? total : total + 1, 0)

        game.players.forEach(player => {
            const user = users.findOrCreate(player)
            user.games++
            user.eligible += eligible
        })

        const winner = users.findOrCreate(game.winner)
        winner.wins++
        winner.points += eligible
    })
    .on('end', () => {
        users.save()
    })
