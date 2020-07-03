const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN
const channelId = process.env.CHANNEL_ID
module.exports.ready = function() {
  return new Promise((res) => {
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      res()
    });
    client.on('message', message => {
      if (message.author.bot || message.channel.id !== channelId) return 
      const msg = message.content.toUpperCase()
      if (msg.includes('YOU') && msg.includes('ALIVE')) {
        const possibilities = [
          "Yes I'm alive ! And you ?",
          "Maybe, I'm just a robot, I don't know...",
          "Yes, but i tell you each days !",
          "You boring me with your questions.",
        ]
        message.channel.send(possibilities[Math.floor(Math.random() * possibilities.length)]);
      }
    });
    client.login(token);
  })
}

/** @param {string} msg */
module.exports.send = function (msg) {
  console.log('Send to Discord')
  // @ts-ignore
  return client.channels.cache.get(channelId).send(msg)
}