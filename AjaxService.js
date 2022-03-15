import merge from "lodash.merge"
import mapValues from "lodash.mapvalues"

import CSRF from "@/utils/CSRF"

class AjaxService {
	static ERROR_KEY = "error"
	static RESULT_KEY = "result"

	#url = null
	#method = null
	#data = null

	constructor ({ url, method, data }) {
		this.#url = url
		this.#method = method
		this.#data = data
		return this.send()
	}

	get requestParams () {
		let params = {
			method: this.#method,
			credentials: "same-origin",
			body: this.requestData,
			headers: {
				Accept: "application/json, text/plain, */*",
				"Content-Type": "application/json;charset=utf-8",
			},
		}
		if (CSRF.token) {
			params.headers["X-CSRF-TOKEN"] = CSRF.token
		}
		return params
	}

	get requestData () {
		if (this.#data.params) {
			let params = mapValues(this.#data.params, val => {
				if (val === undefined) {
					return null
				}
				return val
			})
			return JSON.stringify(merge({ params }, this.#data))
		}
		return JSON.stringify(this.#data)
	}

	async send () {
		let res = await fetch(this.#url, this.requestParams)
		let { [AjaxService.ERROR_KEY]: error, [AjaxService.RESULT_KEY]: result } = await res.json()
		if (error) {
			throw error
		}
		return result
	}
}

export default AjaxService