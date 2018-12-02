import { CONFIG } from 'config';


class AuthApi {
    static login = async (credentials) => {
        try {
            let data = JSON.stringify(credentials);
            const res = await fetch(CONFIG.apiUrl  + 'user/login',{
                method: "POST",
                body: data,
                headers: new Headers({
                    'Content-Type': 'application/json'
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

export default AuthApi;