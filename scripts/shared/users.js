const fs = require('fs')
const USERS_FILENAME = './users.json'

class Users {
    constructor() {
        this.users = JSON.parse(fs.readFileSync(USERS_FILENAME, 'utf8'))
    }

    all = () => {
        return Object.entries(this.users)
    }

    find = (id) => {
        return this.users[id]
    }

    findOrCreate = ({ id, username }) => {
        return this.find(id) || (this.users[id] = {
            username,
            wins: 0,
            games: 0,
            points: 0,
            eligible: 0,
        })
    }

    delete = (id) => {
        delete this.users[id]
    }

    save = () => {
        fs.writeFileSync(USERS_FILENAME, JSON.stringify(this.users, null, 4))
    }

    reset = () => {
        this.users = {}
    }
}

module.exports = new Users()
