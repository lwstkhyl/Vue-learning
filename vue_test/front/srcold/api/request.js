import axios from 'axios';
import store from '../store';
import { baseURL, timeout } from '../../config/config';
import { Message } from 'element-ui';

const service = axios.create({
    baseURL: `${baseURL}/api`,
    timeout: timeout
});

service.interceptors.request.use(config => {
    if (store.state.auth.token) {
        config.headers.Authorization = `Bearer ${store.state.auth.token}`;
    }
    return config;
});

service.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1)
            Message({ message: "请求超时，请检查网络连接", type: 'error' });
        return Promise.reject(error);
    }
);
export default service;
