const PromiseB = require('bluebird')
const axios = require('axios').default
const discord = require('./discord')

const urlsToTests = process.env.URLS.split(',')

async function launch(isFullReport) {
  const { success, failures } = await testUrls()
  if(!isFullReport) {
    if (failures.length) {
      await discord.send(failures.map(formatFail).join('\n'))
    }
  } else {
    await discord.send(formatFullReport(success, failures))
  }
}

function formatFullReport(success, failures) {
  return `
====== FULL REPORT ======
=  Here is your http services :
${urlsToTests.map(url => `= - ${url}`).join('\n')}
=
= Success services :
${success.map(suc => `= - ${suc.status}: ${suc.url}`).join('\n')}
=
= Failed services :
${failures.map(fail => `= - ${fail.status}: ${fail.url}`).join('\n')}
========================
`
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