import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/account/api/',
});

const setAuthToken = (token) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export { api, setAuthToken };
