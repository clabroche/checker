#!/bin/env node
requirements()
const discord = require('./discord')
const http = require('./http')

;(async _ => {
  await discord.ready()
  discord.send(`Hello ! 
I'm starting in version ${require('../package.json').version}
`)
  launchHourly()
  launchDaily()
})()


function requirements() {
  const {DISCORD_TOKEN, URLS, CHANNEL_ID} = process.env
  if(!DISCORD_TOKEN) {
    console.error('Please provide a DISCORD_TOKEN env')
    process.exit(1)
  }
  if (!URLS) {
    console.error('Please provide an URLS env. Example: URLS=http://some-site.com,https://another-site/somewhere')
    process.exit(1)
  }
  if (!CHANNEL_ID) {
    console.error('Please provide an CHANNEL_ID env')
    process.exit(1)
  }
}

function launchHourly() {
  console.log('Launch hourly task')
  return interval(1000 * 60 * 60, async function() {
    await http.launch()
    console.log('Finish hourly task')
  })
}

function launchDaily() {
  console.log('Launch daily task')
  return interval(1000 * 60 * 60 * 24, async function() {
    await iAmAlive()
    console.log('Finish daily task')
  })
}

function interval(intervalNumber, cb) {
  cb()
  return setInterval(() => {
    cb()
  }, intervalNumber);
}

async function iAmAlive() {
  await discord.send("I am ALIIIIIVE !!!! ")
}