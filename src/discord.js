const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN

module.exports.ready = function() {
  return new Promise((res) => {
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      res()
    });
    client.login(token);
  })
}

/** @param {string} msg */
module.exports.send = function (msg) {
  console.log('Send to Discord')
  // @ts-ignore
  return client.channels.cache.get('728652496599384135').send(msg)
}