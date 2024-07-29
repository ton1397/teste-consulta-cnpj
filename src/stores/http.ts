import axios from "axios";
import { defineStore } from "pinia";



interface IHttpRequest {
	url: string,
	method?: string,
	data?: Object
}
export const HttpStore = defineStore("Http", {
	actions: {
		HttpRequest(url: string, method?: string, body?: Object) {
			return new Promise((resolve, reject) => {
				let settings: IHttpRequest = {
					url
				}

				if (method) {
					settings['method'] = method
				}

				if (body) {
					settings['data'] = body
				}
				axios(settings).then((response) => {
					resolve(response.data)
				}).catch((error) => {
					reject(error)
				})
			})
		}
	}
});
