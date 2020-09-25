const fs = require('fs');
const users = require('./shared/users')

const leaderboard = [];

function compare(a, b) {
    if (a.ratio > b.ratio) {
        return -1;
    }

    if (a.ratio < b.ratio) {
        return 1;
    }

    return 0;
}

for (const [id, user] of users.all()) {
    if (user.wins < 1) {
        continue
    }

    user.id = id;
    user.ratio = user.points / user.eligible;
    leaderboard.push(user);
}

leaderboard.sort(compare);

let rank = 0;
let ratio = null;

leaderboard.forEach(user => {
    if (ratio !== user.ratio) {
        rank++;
        ratio = user.ratio;
    }

    user.rank = rank;
});

fs.writeFileSync('./leaderboard.json', JSON.stringify(leaderboard, null, 4))
