const urlEnv1 = 'https://insert.url.here'
const urlEnv2 = 'https://insert.url2.here'

async function getData(username, password, env) {
    if (env === 'env1') {
        return await fetchData(username, password, urlEnv1)
    }
    if (env === 'env2') {
        return await fetchData(username, password, urlEnv2)
    }
}

async function fetchData(username, password, url) {
    const urlFetchMax = 100;
    const credentials64 = Buffer.from(`${username}:${password}`).toString('base64')
    const urlHeaders = {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Context-ObjectCount': '0',
        'Id-Enconding': '0',
        'How-Many': `${urlFetchMax}`,
        'Authorization': `Basic ${credentials64}`
    }
    const urlBody = {
        'filters': {
            //add filters or other body elements here
        }
    }
    try {
        let res = await fetch(url, {
            method: 'POST',
            headers: urlHeaders,
            body: JSON.stringify(urlBody)
        })
        if (res.ok) {
            let data = await res.json()
            return data
        } else {
            console.error(`Response in fetchData corrupt for ${url}`)
            throw new Error('Insert error messages from API here')
        }
    } catch (error) {
        console.error('Error fetching data: ', error)
        throw error
    }
}

module.exports = { getData }