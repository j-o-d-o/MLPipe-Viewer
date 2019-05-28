import { CONFIG } from 'config';
import * as middleware from './middleware';


class AuthApi {
    static login = async (credentials) => {
        try {
            const data = JSON.stringify(credentials);
            const res = await fetch(CONFIG.apiUrl  + 'user/login',{
                method: "POST",
                body: data,
                headers: new Headers({
                    'Content-Type': 'application/json'
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

export default AuthApi;