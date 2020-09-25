const fs = require('fs')
const Crypto = require('crypto');
const users = require('./shared/users')
const CLAIMS_DIRECTORIES = './claims'

async function processGames(path) {
    const dir = await fs.promises.opendir(path)

    for await (const dirent of dir) {
        if (dirent.isDirectory()) {
            try {
                await processClaims(path + '/' + dirent.name)
            } catch (error) {
                console.error(error)
            }
        }
    }

    users.save()
}

async function processClaims(path) {
    const dir = await fs.promises.opendir(path)
    const claimants = {}
    let claim = null
    let consensus = null

    for await (const dirent of dir) {
        claim = JSON.parse(fs.readFileSync(path + "/" + dirent.name, 'utf8'))

        if (consensus === null) {
            consensus = hash(JSON.stringify(claim.game))
            claimants[claim.game.winner.id] = false
            claim.game.losers.forEach(loser => {
                claimants[loser.id] = false
            })
        } else if (consensus !== hash(JSON.stringify(claim.game))) {
            throw new Error("conflict")
        }

        claimants[claim.submitted_by.id] = true
    }

    if (!claim) {
        return
    }

    for (const [claimant, agreed] of Object.entries(claimants)) {
        if (!agreed) {
            throw new Error(claimant + " has not agreed")
        }
    }

    applyUserStats(claim)
    fs.rmdirSync(path, { recursive: true })
}

function applyUserStats(claim) {
    // the total number of game points eligible to win is one for every non-bot player
    // we start at 1 because the winner _shouldn't_ be a bot
    const eligible = claim.game.losers.reduce((total, player) => player.bot ? total : total + 1, 1)

    // no reward for 1-player games
    if (eligible < 2) {
        return
    }

    const winner = users.findOrCreate(claim.game.winner)
    winner.wins++
    winner.games++
    winner.points += eligible
    winner.eligible += eligible

    claim.game.losers.forEach(loser => {
        const user = users.findOrCreate(loser)
        user.games++
        user.eligible += eligible
    })
}

function hash(value) {
    return Crypto.createHash('sha1').update(value).digest('hex')
}

if (fs.existsSync(CLAIMS_DIRECTORIES)) {
    processGames(CLAIMS_DIRECTORIES).catch(console.error)
}
