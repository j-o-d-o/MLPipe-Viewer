import { CONFIG } from 'config';
import * as authUtil from 'utils/auth.util';


class UserApi {
    static getList = async (filters={}) => {
        try {
            const token = "Bearer " + authUtil.getToken();
            const res = await fetch(CONFIG.apiUrl  + 'jobs',{
                method: "GET",
                headers: new Headers({
                    'Authorization': token
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
                json: error
            }
        }
    }
}

export default UserApi;