const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.DISCORD_TOKEN
const channelId = process.env.CHANNEL_ID
const http = require('./http');
const axios = require('axios').default;
let bearer = null
const commands = {
  '/AUTOTEST': {
    cb: () => http.launch(true),
    description: 'Launch a test on all your services'
  },
  '/ISALIVE': {
    cb: areYouAlive,
    description: 'Check if i am alive'
  },
  '/LIST': {
    cb: http.list,
    description: 'List all your services'
  },
  '/LIST:ADD': {
    cb: http.addInList,
    description: 'Add a service (ex: /list:add https://google.fr)'
  },
  '/LIST:REMOVE': {
    cb: http.removeInList,
    description: 'Remove a service (ex: /list:remove https://google.fr)'
  },
  '/HELP': {
    cb: help,
    description: 'Show this help'
  },
}
module.exports.ready = function() {
  return new Promise((res) => {
    client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
      res()
    });
    client.on('message', message => {
      if (message.author.bot || message.channel.id !== channelId) return 
      const msg = message.content.toUpperCase().split(' ')[0]
      console.log(msg)
      Object.keys(commands).map(command => {
        if (msg === command) {
          commands[command].cb(message.content.toLowerCase().replace(command.toLocaleLowerCase(), '').trim())
        }
      })
    });
    client.login(token);
  })
}
function help() {
  return module.exports.send(new Discord.MessageEmbed()
    .setColor('#faa329')
    .setAuthor("Help", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Lol_question_mark.png/604px-Lol_question_mark.png")
    .setDescription(Object.keys(commands).map(command => `- ${command.toLowerCase()}: ${commands[command].description}`).join('\n'))
    .setTimestamp()
    )
}

function areYouAlive(message) {
  const possibilities = [
    "Yes I'm alive ! And you ?",
    "Maybe, I'm just a robot, I don't know...",
    "Yes, but i tell you each days !",
    "You boring me with your questions.",
  ]
  message.channel.send(possibilities[Math.floor(Math.random() * possibilities.length)]);
}


/** @param {string} msg */
module.exports.send = function (msg) {
  console.log('Send to Discord')
  // @ts-ignore
  return client.channels.cache.get(channelId).send(msg)
}


/** @param {string} msg */
module.exports.sendWithApi = function (msg) {
  axios.post(`https://discord.com/api/v6/channels/${channelId}/messages`, msg, {
    headers: {
      Authorization: `Bot ${token}`
    }
  })
}