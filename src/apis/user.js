import { CONFIG } from 'config';
import * as authUtil from 'utils/auth.util';
import * as middleware from './middleware';


class UserApi {
    static get = async (userId) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'user/' + userId,{
                method: "GET",
                headers: new Headers({
                    'Authorization': token
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error
            }
        }
    }

    static getList = async () => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'users', {
                method: "GET",
                headers: new Headers({
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static create = async(data) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const jsonData = JSON.stringify(data);
            const res = await fetch(CONFIG.apiUrl  + 'user/register', {
                method: "POST",
                body: jsonData,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static update = async(userId, data) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const jsonData = JSON.stringify(data);
            const res = await fetch(CONFIG.apiUrl  + 'user/' + userId, {
                method: "PUT",
                body: jsonData,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static setInactive = async(userId) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'user/' + userId + "/setInactive", {
                method: "PUT",
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.jsonData,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }
}

export default UserApi;