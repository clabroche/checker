const PromiseB = require('bluebird')
const axios = require('axios').default
const discord = require('./discord')

const urlsToTests = process.env.URLS.split(',')

async function launch() {
  const { success, failures } = await testUrls()
  if (failures.length) {
    await discord.send(failures.map(formatFail).join('\n'))
  }
}


function formatFail(failure) {
  return `
===== ${failure.url} ==================
== Status: ${failure.status}
=========================================
`
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