const fs = require('fs');
const users = require('./shared/users')
const aliases = JSON.parse(fs.readFileSync('./aliases.json', 'utf8'))

function checkAlias(aid, { id, name }) {
    const alias = users.find(aid)

    if (!alias) {
        return
    }

    const user = users.findOrCreate({ id, name })

    user.wins += alias.wins
    user.games += alias.games
    user.points += alias.points
    user.eligible += alias.eligible

    users.delete(aid)
}

for (const [id, { target }] of Object.entries(aliases)) {
    checkAlias(id, target)
}

users.save()
