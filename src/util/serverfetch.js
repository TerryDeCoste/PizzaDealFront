const BASE_URL = "http://localhost:3030";

module.exports = (url, data={}) => {
    return fetch(BASE_URL + url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(res => res.json());
}