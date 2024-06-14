import axios from 'axios';

export const API_URL = 'http://127.0.0.1:8000/account/api/';

export const API_URL_ADMIN = 'http://127.0.0.1:8000/adminside/'

const register = async (userData) => {
    try {
        const response = await axios.post(API_URL + 'register/', userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

const login = async (userData) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await axios.post(API_URL + 'login/', userData, config);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};
const admin_login = async (userData) => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };
        const response = await axios.post(API_URL_ADMIN + 'admin_login/', userData, config);
       
        if (response.data) {
            localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

const logout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    try {
        if (user && user.refreshToken) {
            await axios.post(
                API_URL + 'logout/',
                { refreshToken: user.refreshToken },
                {
                    headers: {
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                }
            );
        }
    } catch (error) {
        throw error.response ? error.response.data : error;
    } finally {
        localStorage.removeItem('user');
    }
};

const authService = {
    register,
    login,
    admin_login,
    logout,
};

export default authService;
