const readlineSync = require('readline-sync') //Using this for masking passwords

async function getCredentials() {
    const username = readlineSync.question('Enter username: ')
    const password = readlineSync.question('Enter password: ', { //Settings for masking the password
        hideEchoBack: true,
        mask: '*'
    })
    return { username, password }
}

module.exports = { getCredentials }