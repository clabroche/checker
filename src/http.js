const PromiseB = require('bluebird')
const axios = require('axios').default
const discord = require('./discord')
const Discord = require('discord.js');
const fse = require('fs-extra')
const path = require('path')

const urlsToTests = process.env.URLS.split(',')
const jsonPath = path.resolve(__dirname, 'urlToTests.json')
if(!fse.existsSync(jsonPath)) {
  saveUrls()
} else {
  fse.readJsonSync(jsonPath).map(url => {
    if(!urlsToTests.includes(url)) {
      urlsToTests.push(url)
    }
    saveUrls()
  })

}

async function saveUrls() {
  return fse.writeFile(jsonPath, JSON.stringify(urlsToTests), 'utf-8')
}

async function launch(isFullReport) {
  const { success, failures } = await testUrls()
  const failedEmbed = createEmbededReport(false, failures.map(fail => ` - ${fail.status}: ${fail.url}`).join('\n'))
  const sucessEmbed = createEmbededReport(true, success.map(suc => ` - ${suc.status}: ${suc.url}`).join('\n'))
  if(!isFullReport) {
    if (failures.length) {
      await discord.send(failedEmbed)
    }
  } else {
    if(success.length) await discord.send(sucessEmbed) 
    if(failures.length) await discord.send(failedEmbed)
  }
}

module.exports.list = function list() {
  return discord.send(new Discord.MessageEmbed()
    .setColor('#fefefe')
    .setAuthor("All your services", "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Antu_view-list-details.svg/1024px-Antu_view-list-details.svg.png")
    .setDescription(urlsToTests.map(urls => `- ${urls.toLowerCase()}`).join('\n'))
    .setTimestamp()
  )
}
module.exports.addInList = function addInList(url) {
  if (!url) {
    return discord.send(createEmbededReport(false, 'You should provide an url', 'Error'))
  }
  urlsToTests.push(url)
  saveUrls()
  module.exports.list()
}

module.exports.removeInList = function removeInList(url) {
  if (!url) {
    return discord.send(createEmbededReport(false, 'You should provide an url', 'Error'))
  }
  const index = urlsToTests.indexOf(url)
  urlsToTests.splice(index, 1)
  saveUrls()
  module.exports.list()
}


function createEmbededReport(isGood = true, description, _author) {
  let author = isGood ? 'Success services' : 'Failed services'
  if(_author) author = _author
  const icon = isGood ? 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Check_green_icon.svg/1200px-Check_green_icon.svg.png' : 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Flat_cross_icon.svg/1024px-Flat_cross_icon.svg.png'
  const color = isGood ? '#6db546' : '#d45657'
  return new Discord.MessageEmbed()
    .setColor(color)
    .setAuthor(author, icon)
    .setDescription(description)
    .setTimestamp()
    .setFooter('', icon);
}

async function testUrls() {
  const success = []
  const failures = []
  await PromiseB.map(urlsToTests, async url => {
    console.log('Check', url)
    const res = await axios.get(url, { timeout: 5000 }).catch(err => err.response || { status: err.code })
    const result = { url, status: res.status || 'No status code' }
    res.status === 200
      ? success.push(result)
      : failures.push(result)
  }, { concurrency: 6 })
  return { success, failures }
}


module.exports.launch = launch