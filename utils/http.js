const request = require('request');

const API_VERSION = '7'
const ASYNC_BASE_URI = ({ account_id }) => `https://ads-api.twitter.com/${API_VERSION}/stats/jobs/accounts/${account_id}`;
const SYNC_BASE_URI = ({ account_id }) => `https://ads-api.twitter.com/${API_VERSION}/stats/accounts/${account_id}`;

class HttpClient {

    constructor(account_id = null, tokens = {}) {
        this._account_id = account_id;
        this._consumer_key = tokens.consumer_key || null;
        this._consumer_secret = tokens.consumer_secret || null;
        this._access_token = tokens.access_token || null;
        this._token_secret = tokens.token_secret || null;
    }

    get account_id() {
        return this._account_id;
    }

    get consumer_key() {
        return this._consumer_key
    }

    get consumer_secret() {
        return this._consumer_secret
    }

    get access_token() {
        return this._access_token
    }

    get token_secret() {
        return this._token_secret
    }

    // request wrapper, return Promise
    sendRequest(options, headers = {}) {
        const baseOption = {
            method: 'POST',
            timeout: 10000, // 10 sec
            rejectUnauthorized: false, // ignore cert error
            headers: {
                'User-Agent': 'Twitter Ads Analytics Debugger'
            }
        };
        // merge headers
        for (let key in headers) {
            baseOption.headers[key] = headers[key];
        }
        // merge request options
        const option = Object.assign(baseOption, options);

        return new Promise((resolve, reject) => {
            request(option, (error, res, body) => {
                if (!error && res.statusCode == 200) {
                    resolve(body);
                } else if (error && typeof error === 'object') {
                    reject(['000', JSON.stringify(error, Object.getOwnPropertyNames(error), null, 4)]);
                } else {
                    reject([res.statusCode, body]);
                }
            })
        })
    }

    get_async_jobs(params, headers = {}) {
        const option = {
            method: 'GET',
            oauth: {
                consumer_key: this.consumer_key,
                consumer_secret: this.consumer_secret,
                token: this.access_token,
                token_secret: this.token_secret
            },
            url: ASYNC_BASE_URI({ account_id: this.account_id }),
            qs: params
        };
        return this.sendRequest(option, headers)
    }

    post_async_jobs(params, headers = {}) {
        const option = {
            oauth: {
                consumer_key: this.consumer_key,
                consumer_secret: this.consumer_secret,
                token: this.access_token,
                token_secret: this.token_secret
            },
            url: ASYNC_BASE_URI({ account_id: this.account_id }),
            qs: params
        };
        return this.sendRequest(option, headers)
    }

    get_async_data(url) {
        return this.sendRequest({ method: 'GET', url: url, encoding: null })
    }

    get_sync_data(params, headers = {}) {
        const option = {
            method: 'GET',
            oauth: {
                consumer_key: this.consumer_key,
                consumer_secret: this.consumer_secret,
                token: this.access_token,
                token_secret: this.token_secret
            },
            url: SYNC_BASE_URI({ account_id: this.account_id }),
            qs: params
        };
        return this.sendRequest(option, headers)
    }
}

module.exports = HttpClient;
