const Discord = require("discord.js");
const client = new Discord.Client();

const db = require("./models/");
const Clips = require("./models").Clips;
const dotenv = require("dotenv");
const uuid = require("uuid/v3");

dotenv.config("./.env");

client.once({ channel: "general" }, () => {
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
        message_id: uuid(explodeContent[1].toString(), uuid.URL),
        clip_url: explodeContent[1].toString(),
        clip_title: "notneeded"
      }).then(result => {
        msg.reply(
          "this clip has been submitted. Cast your vote type\n\t\t !upvote " +
            result.message_id
        );
      });
    } else if (explodeContent.length <= 2) {
      msg.reply("to many inputs.\n Please try again.");
    } else {
      msg.reply("this is not a twitch clip.");
    }
  }
  if (explodeContent[0] === "!submitted") {
    Clips.findAll({
      limit: 10,
      order: [["reactions", "DESC"]]
    })
      .then(results => {
        results.forEach(result => {
          msg.reply(
            "Upvotes: " +
              result.reactions +
              " | " +
              result.clip_title +
              " posted by " +
              result.username +
              " \n " +
              result.clip_url +
              "\n\t\t to vote type !upvote " +
              result.message_id
          );
        });
      })
      .catch(err => {
        msg.reply("No content to display!");
      });
  }
  if (explodeContent[0] === "!upvote" && explodeContent[1] !== "undefined") {
    msg.reply("+1 to clip " + explodeContent[1].toString());
    Clips.findOne({
      where: {
        message_id: explodeContent[1].toString()
      }
    })
      .then(result => {
        result.update({
          reactions: (result.reactions += 1)
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  if (explodeContent[0] === "!contest") {
    msg.reply(
      "\nhttps://github.com/dhurley94/submit-bot-discord\n\n Usage:\n\t !submit <clip_url> \n\t!submitted : will return top 10 clips currently \n\t!upvote <unique_id> will upvote the video"
    );
  }
});

db.sequelize.sync({ force: false });

client.login(process.env.TOKEN);
