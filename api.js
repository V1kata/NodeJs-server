const host = 'https://parseapi.back4app.com';
const appId = 'AXOdcKtwQQguAYZgorwZPa2DqMM4blc8EKuIb5mW';
const apiKey = '7lXdNmYhkvgv7TYBJHwdJCz8tjZpn2fivfNRgy9X';

async function request(method, url, data) {
    const options = {
        method,
        headers: {
            'X-Parse-Application-Id': appId,
            'X-Parse-REST-API-Key': apiKey
        }
    }

    if (data) {
        options.headers['Content-type'] = 'application/json';
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(host + url, options);
        
        if (response.status === 204) {
            return response;
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.error);
        }
        
        return data;
    } catch (err) {
        throw err;
    }
}

const get = request.bind(null, 'get');
const put = request.bind(null, 'put');
const post = request.bind(null, 'post');
const del = request.bind(null, 'delete');

module.exports = {
    get, post, put, del
}