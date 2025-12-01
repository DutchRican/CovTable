const URL = 'https://www.worldometers.info/coronavirus';

async function fetchPage(page) {
    const url = !!page ? `${URL}/country/${page}/` : URL;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw Error(!!page ? `Invalid country name: ${page}` : 'Could not fetch the requested data');
        }
        return response.text();
    } catch (err) {
        throw err;
    }
}

module.exports = { fetchPage };