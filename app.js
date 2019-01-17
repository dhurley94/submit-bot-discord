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
                    username: msg.author,
                    clip_url: explodeContent[1]
                })
                .then(result => {
                    msg.reply("this clip has been submitted.");
                })
                .catch(error => {
                    console.log(error, 'failed to write to database.')
                })

        }
    }
    if (explodeContent[0] === "!submitted") {
        Clips.findAll({
            raw: true
        })
        .then(users => {
            console.log(users)
            msg.reply(users.toJSON());
        })
    }
});

client.login(process.env.TOKEN);

db.sequelize.sync({
    force: false
})