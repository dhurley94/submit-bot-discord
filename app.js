const discord = require('discord.js');
const db = require('./models/')
const Clips = require('./models').Clips
const dotenv = require('dotenv')

dotenv.config('./.env')

const client = new discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg => {
    const content = msg.content;
    const explodeContent = content.split(" ");
    if (explodeContent[0] === "!submit") {
        const checkValid = /^(https):\/\/www.twitch.tv[^ "]+$/.test(
            explodeContent[1]
        );
        if (checkValid) {
            Clips.create({
                    username: msg.author.toString(),
                    clip_url: explodeContent[1].toString()
                })
                .then(result => {
                    msg.reply("this clip has been submitted.");
                })
                .catch(error => {
                    console.log(error, 'failed to write to database.')
                })

        } else {
            msg.reply('This is not a twitch clip.')
        }
    } 
    if (explodeContent[0] === "!submitted") {
        Clips.findAll({
            raw: true,
            limit: 10
        })
        .then(users => {
            console.log(users)

            let topTen = '';
            for (user in users) {
                topTen += user.username + '\n'
            }
            msg.reply(topTen)
        })
    }
});

client.login(process.env.TOKEN);

db.sequelize.sync({
    force: false
})