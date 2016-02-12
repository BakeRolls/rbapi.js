'use strict'

var http = require('http')
var moment = require('moment')
var sha1 = require('sha1')

class RocketBeans {
	constructor(key, secret, id) {
		this.key = key
		this.secret = secret
		this.id = id || '00000000-0000-0000-0000-000000000000'
		this.host = 'api.rocketmgmt.de'

		return this
	}

	rand(num) {
		return Math.random().toString(36).slice(num)
	}

	base64encode(str) {
		return new Buffer(str).toString('base64')
	}

	get(endpoint) {
		let created = moment().format("YYYY-MM-DDTHH:mm:ssZZ")
		let nonce = `${this.id}${created}${this.rand(10)}`
		let sha = sha1(`${nonce}${created}${this.secret}`)

		return new Promise((resolve, reject) => {
			http.request({
				host: this.host,
				path: `/${endpoint}`,
				headers: {
					'Accept': 'application/json',
					'Authorization': 'WSSE profile="UsernameToken"',
					'X-WSSE': `UsernameToken Username="${this.key}", PasswordDigest="${this.base64encode(sha)}", Nonce="${this.base64encode(nonce)}", Created="${created}"`
				}
			}, (response) => {
				let json = ''

				response.on('data', (chunk) => json += chunk)
				response.on('end', () => resolve(JSON.parse(json)))
				response.on('error', (error) => reject(error))
			}).end()
		})
	}
}

module.exports = RocketBeans
