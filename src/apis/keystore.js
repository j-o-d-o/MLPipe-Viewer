import { CONFIG } from 'config';
import * as authUtil from 'utils/auth.util';
import * as middleware from './middleware';


class KeystoreApi {
    static get = async (userId) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'keystore',{
                method: "GET",
                headers: new Headers({
                    'Authorization': token
                })
            });
            const json = await res.json();
            middleware.apply(res, json);
            return {
                status: res.status,
                json
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
            const res = await fetch(CONFIG.apiUrl  + 'keystore', {
                method: "POST",
                body: jsonData,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                })
            });
            const json = await res.json();
            middleware.apply(res, json);
            return {
                status: res.status,
                json
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
            const res = await fetch(CONFIG.apiUrl  + 'keystore/' + keyId,{
                method: "DELETE",
                headers: new Headers({
                    'Authorization': token
                })
            });
            const json = await res.json();
            middleware.apply(res, json);
            return {
                status: res.status,
                json
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