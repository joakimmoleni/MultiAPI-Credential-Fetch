const { getData } = require('./getData')
const { WebSocketServer } = require('ws')
const sockServer = new WebSocketServer({ port: 6066 })

sockServer.on('connection', (ws) => {
    console.log('New client on the line')
    ws.send('Connection initialized')

    ws.on('close', () => {
        console.log('Connected client dropped')
    })

    ws.on('message', (data) => {
        sockServer.clients.forEach((client) => {
            console.log(`Message from client: ${data}`)
        })
    })

    ws.onerror = () => {
        console.log('WebSocket error')
    }
})

function sendToClients(type, data) {
    sockServer.clients.forEach((client) => {
        client.send(JSON.stringify({ type, array: data }))
        console.log(`${type} data sent to client`)
    })
}

function formatData(data) {
    let clientdata = []
    for (let i = 0; i > data.length; i++) {
        let item = data[i]
        let properties = {
            app: item
            // insert names here for formatting to client
        }
        clientdata.push(properties)
    }
    return clientdata
}

async function broadcastData(username, password) {
    const clients = sockServer.clients

    if (clients.size === 0) {
        console.log('No clients connected, skipping broadcast')
        return
    }

    try {
        const results = await Promise.allSettled([
            getData(username, password, 'env1'),
            getData(username, password, 'env2')
        ])

        results.forEach((res, index) => {
            const env = ['env1', 'env2'][index]

            if (res.status === 'fulfilled') {
                const formattedData = formatData(res.value)
                sendToClients(env, formattedData)
            } else {
                console.error(`Failed to fetch data for ${env}, will try again in 60s`, res.reason)
            }
        })
    } catch (err) {
        console.error('Unexpected error occurred during broadcast', err)
    }
}

module.exports = { broadcastData }