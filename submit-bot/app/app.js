const Discord = require("discord.js");
const db = require("./models/");
const Clips = require("./models").Clips;
const dotenv = require("dotenv");
// const Collection = require("./utils/Collection");
// const PREFIX = "!";

dotenv.config("./.env");

const client = new Discord.Client();

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", async msg => {
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
        message_id: msg.id,
        clip_url: explodeContent[1].toString()
      })
        .then(result => {
          msg.reply(
            "this clip has been submitted.\nview it here https://blog-dhurley.herokuapp.com/"
          );
          const filter = (reaction, user) => {
            return (
              ["👍", "👎"].includes(reaction.emoji.name) &&
              user.id === msg.author.id
            );
          };

          msg
            .awaitReactions(filter, { max: 1, time: 600000, errors: ["time"] })
            .then(collected => {
              const reaction = collected.first();

              if (reaction.emoji.name === "👍") {
                msg.reply("+1 to clip " + explodeContent[1].toString());
                Clips.update(
                  { reaction: (reaction += 1) },
                  { where: { username: msg.author.username.toString() } }
                ).catch(error => {
                  console.log(error);
                });
              }
            })
            .catch(collected => {
              console.log(`Collected ${collected.size} upvotes.`);
            });
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      msg.reply("this is not a twitch clip.");
    }
  }
  if (explodeContent[0] === "!submitted") {
    Clips.findAll({ limit: 10 }).then(results => {
      console.log(results);
    });
  }
  if (explodeContent[0] === "!contest") {
    msg.reply("this is a contest");
  }
});

client.login(process.env.TOKEN);

db.sequelize.sync({
  force: false
});