import { CONFIG } from 'config';
import * as authUtil from 'utils/auth.util';
import * as middleware from './middleware';


class KeystoreApi {
    static get = async (userId) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'keys', {
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

    static create = async (keyName) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const jsonData = JSON.stringify({name: keyName});
            const res = await fetch(CONFIG.apiUrl  + 'key', {
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

    static delete = async (keyId) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'key/' + keyId,{
                method: "DELETE",
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
}

export default KeystoreApi;