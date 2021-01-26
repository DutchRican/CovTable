const axios = require('axios');

const URL = 'https://www.worldometers.info/coronavirus';

async function fetchPage(page) {
    const url = !!page ? `${URL}/country/${page}/` : URL;
    try {
        const { data, request: { path } } = await axios.get(url);
        if (path.includes('404')) throw new Error('Invalid country name: ' + page);
        return data;
    } catch (err) {
        throw err;
    }
}

module.exports = { fetchPage };