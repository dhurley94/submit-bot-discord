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
          clip_title: explodeContent[2].toString(),
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
            .awaitReactions(filter, {
              max: 1,
              time: 600000,
              errors: ["time"]
            })
            .then(collected => {
              const reaction = collected.first();

              if (reaction.emoji.name === "👍") {
                msg.reply("+1 to clip " + explodeContent[1].toString());
                Clips.update({
                  reactions: (reaction += 1)
                }, {
                  where: {
                    username: msg.author.username.toString()
                  }
                }).catch(error => {
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
    } else if( explodeContent[2] === 'undefined')  {
      msg.reply('a title is required for submission.')
    } else if(explodeContent.length <= 3) {
      msg.reply('to many inputs.\n Please try again.')
    } else {
      msg.reply("this is not a twitch clip.");
    }
  }
  if (explodeContent[0] === "!submitted") {
    Clips.findAll({
      limit: 10
    }).then(results => {
      results.forEach(result => {
        msg.reply("Upvotes: " + result.reactions + " | " + result.clip_title + " posted by " + result.username + " \n " + result.clip_url);
      });
    });
  }
  if (explodeContent[0] === "!info") {
    msg.reply("https://github.com/dhurley94/submit-bot-discord \nhttps://blog-dhurley.herokuapp.com/\n\n Usage:\n\t !submit <clip_url> <title>");
  }
});

client.login(process.env.TOKEN);

db.sequelize.sync({
  force: false
});