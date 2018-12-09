import { CONFIG } from 'config';
import * as authUtil from 'utils/auth.util';


class UserApi {
    static getList = async (filters={}) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'jobs',{
                method: "GET",
                headers: new Headers({
                    'Authorization': token,
                })
            });
            const json = await res.json();
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

    static create = async(type, data) => {
        try {
            // type can be any of: ["local", "aws"]
            const token = "Bearer " + authUtil.getToken();
            console.log(data);
            const jsonData = JSON.stringify(data);
            console.log(jsonData);
            const res = await fetch(CONFIG.apiUrl  + 'job/' + type, {
                method: "POST",
                body: jsonData,
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Authorization': token,
                })
            });
            const json = await res.json();
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
}

export default UserApi;