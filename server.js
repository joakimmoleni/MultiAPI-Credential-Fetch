const { createServer } = require('http')
const { getCredentials } = require('./credentials')
const { broadcastData } = require('./broadcastData')

const hostname = '127.0.0.1'
const port = 666

const server = createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/plain')
    res.end('tjing')
})

async function main() {
    const { username, password } = await getCredentials(); // Get credentials from terminal when starting for API access
    server.listen(port, hostname, () => { // Runs the server
        console.log(`Server running on http://${hostname}:${port}`)
    })
    setInterval(() => { // Doing an interval to continously fetch data and reload and send to client
        broadcastData(username, password) //Use the credentials for broadcasting
    }, 60000)
}