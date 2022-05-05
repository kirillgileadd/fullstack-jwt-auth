import axios, {AxiosRequestConfig} from "axios";
import {AuthResponse} from "../models/AuthResponse";

export const BASE_URL = 'http://localhost:5000/api'

const $api = axios.create({
    withCredentials: true,
    baseURL: BASE_URL
})

$api.interceptors.request.use((config) => {
    config.headers!.Authorization = `Bearer ${localStorage.getItem('token')}`

    return config
})

$api.interceptors.response.use((config) => {
    return config
}, async (error) => {
    const request = error.config
    if(error.response.status === 401 && error.config && !error.config._isRetry) {
        request._isRetry = true
        try {
            const response = await axios.get<AuthResponse>(`${BASE_URL}/refresh`, {withCredentials: true})
            localStorage.setItem('token', response.data.accessToken)
            return $api.request(request)
        } catch (e) {
            console.log(e);
        }
    }
    throw error
})

export default $api