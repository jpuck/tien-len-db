const fs = require('fs')
const https = require('https');
const { rank } = require('./shared/ranker')
const { diff } = require('./shared/differ')
const users = require('./shared/users')
const LEADERBOARD_FILENAME = './leaderboard.json'
const ANNOUNCE = process.argv.includes('--no-announce') ? false : true

const getLeaderboard = () => {
    return JSON.parse(fs.readFileSync(LEADERBOARD_FILENAME, 'utf8'))
}

const saveLeaderboard = leaderboard => {
    fs.writeFileSync(LEADERBOARD_FILENAME, JSON.stringify(leaderboard, null, 4))
}

const formatDiscordId = player => {
    if (!player.id.startsWith('discord')) {
        return player.username
    }

    return '<@' + player.id.substring(8) + '>'
}

const SUPER_SCRIPTS = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
}

const formatSuperscript = input => {
    const string = `${input}`
    let formatted = ''

    for (let i = 0; i < string.length; i++) {
        formatted += SUPER_SCRIPTS[string.charAt(i)]
    }

    return formatted
}

const formatNews = news => {
    let content = ''
    let stonks = undefined

    news.forEach(player => {
        const username = formatDiscordId(player) + formatSuperscript(player.rank)

        if (player.old_rank_diff > 0) {
            if (!stonks) {
                content += '🚀 stonks\n'
                stonks = true
            }
        } else if (stonks) {
            content += '\n📉 not stonks\n'
            stonks = false
        }

        if (player.old_rank_diff === Infinity) {
            content += `${username} is on the board\n`
            return
        }

        const action = player.old_rank_diff > 0
            ? 'moved up'
            : 'dropped'

        const plural = (player.old_rank_diff > 1 || player.old_rank_diff < -1)
            ? 's'
            : ''

        content += `${username} ${action} ${Math.abs(player.old_rank_diff)} rank${plural}\n`
    })

    return content
}

const postToDiscord = async content => {
    return new Promise((resolve, reject) => {
        const url = process.env.DISCORD_WEBHOOK_URL

        const options = {
            headers: {
                'User-Agent': 'jpuck/tien-len-db leaderboard pipeline',
                'Content-Type': 'application/json',
            },
            method: 'POST',
        };

        const request = https.request(url, options, response => {
            let data = '';

            response.on('data', chunk => {
                data += chunk;
            });

            response.on('end', () => {
                resolve({
                    status: response.statusCode,
                    data,
                });
            });
        }).on("error", error => reject(error));

        request.write(JSON.stringify(content));
        request.end();
    });
}

const announceInDiscord = async news => {
    if (!news.length) {
        console.log('no news')
        return
    }

    const content = formatNews(news)

    const payload = {
        username: 'Leaderboard Disrupted',
        content,
        embeds: [
            {
                title: "leaderboard.tienlen.org",
                url: "https://leaderboard.tienlen.org",
                color: 0xf1c40f,
            },
        ],
    }

    return await postToDiscord(payload)
}

(async () => {
    // rank users
    const leaderboard = rank(users.all())

    // get old leaderboard
    const old = getLeaderboard()

    // find diffs
    const news = diff(old, leaderboard)

    // emit diff events
    if (ANNOUNCE) {
        const response = await announceInDiscord(news)
        console.log(response)
    }

    // save new leaderboard
    saveLeaderboard(leaderboard)
})()
