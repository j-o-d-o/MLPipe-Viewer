import { CONFIG } from 'config';
import * as authUtil from 'utils/auth.util';
import * as middleware from './middleware';


class ServerApi {
    static getRequestList = async () => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + '/server/awsspotrequest',{
                method: "GET",
                headers: new Headers({
                    'Authorization': token
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.json,
            };
        } catch(error) {
            return {
                status: -1,
                json: error
            }
        }
    }

    static createSpotRequest = async (data) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const jsonData = JSON.stringify(data);
            const res = await fetch(CONFIG.apiUrl  + '/server/awsspotrequest', {
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
                json: res.json,
            };
        } catch(error) {
            return {
                status: -1,
                json: error,
            }
        }
    }

    static cancelRequest = async (requestId) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + '/server/awsspotrequest/' + requestId, {
                method: "DELETE",
                headers: new Headers({
                    'Authorization': token
                })
            });
            await middleware.apply(res);
            return {
                status: res.status,
                json: res.json,
            };
        } catch(error) {
            return {
                status: -1,
                json: error
            }
        }
    }
}

export default ServerApi;