import { CONFIG } from 'config';
import * as authUtil from 'utils/auth.util';


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