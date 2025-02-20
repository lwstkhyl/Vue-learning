import axios from 'axios';
import store from '../store';
import { baseURL, timeout } from '../../config/config';

const service = axios.create({
    baseURL: `${baseURL}/api`,
    timeout: timeout
});

service.interceptors.request.use(config => {
    if (store.state.token) {
        config.headers.Authorization = `Bearer ${store.state.token}`;
    }
    return config;
});

export default service;
