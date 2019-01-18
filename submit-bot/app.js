const discord = require("discord.js");
const db = require("./models/");
const Clips = require("./models").Clips;
const dotenv = require("dotenv");
const Collection = require('./utils/Collection')

dotenv.config("./.env");

const client = new discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

/**
 *
 */
client.on("message", msg => {
  const content = msg.content;
  const explodeContent = content.split(" ");
  if (explodeContent[0] === "!submit") {
    const checkValid_one = /^(https):\/\/www.twitch.tv\/(.*)\/clip[^ "]+$/.test(
      explodeContent[1]
    );
    const checkValid_two = /^(https):\/\/clips.twitch.tv\/[^ "]+$/.test(
      explodeContent[1]
    );
    if (checkValid_one || checkValid_two) {
      Clips.create({
        username: msg.author.username.toString(),
        clip_url: explodeContent[1].toString() //<iframe src="https://clips.twitch.tv/embed?clip=FaintNurturingBibimbapKreygasm" frameborder="0" allowfullscreen="true" height="378" width="620"></iframe>
      })
        .then(result => {
          msg.reply("this clip has been submitted.");
        })
        .catch(error => {
          console.log(error, "failed to write to database.");
        });
        this.reactions = new Collection();
        if (msg.reactions && msg.reactions.length > 0) {
          for (const reaction of msg.reactions) {
            const id = reaction.emoji.id ? `${reaction.emoji.name}:${reaction.emoji.id}` : reaction.emoji.name;
            this.reactions.set(id, new MessageReaction(this, reaction.emoji, reaction.count, reaction.me));
          }
        }
    } else {
      msg.reply("This is not a twitch clip.");
    }
  }
});

client.login(process.env.TOKEN);

db.sequelize.sync({
  force: false
});
